import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: varchar("username"),
  profileImageUrl: varchar("profile_image_url"),
  zipCode: varchar("zip_code", { length: 10 }),
  // Tax settings
  state: varchar("state", { length: 2 }), // US state code for tax calculation
  localTaxRate: decimal("local_tax_rate", { precision: 5, scale: 4 }), // Local tax rate as decimal
  // Preferences
  preferredLanguage: varchar("preferred_language", { length: 5 }).default('en').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Jobs table - tracks multiple workplaces
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  color: varchar("color", { length: 7 }).default('#3B82F6'), // Hex color for UI
  isActive: integer("is_active").default(1).notNull(), // 1 = active, 0 = archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
  shifts: many(shifts),
}));

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Shifts table - individual work shifts with tips and earnings
export const shifts = pgTable("shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  employerId: varchar("employer_id").references(() => employers.id, { onDelete: 'set null' }),
  date: date("date").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }).notNull(),
  hourlyWage: decimal("hourly_wage", { precision: 8, scale: 2 }).notNull(),
  cashTips: decimal("cash_tips", { precision: 10, scale: 2 }).default('0').notNull(),
  creditTips: decimal("credit_tips", { precision: 10, scale: 2 }).default('0').notNull(),
  coversServed: integer("covers_served").default(0),
  tipOut: decimal("tip_out", { precision: 5, scale: 2 }).default('0').notNull(), // Percentage of tips shared with others
  notes: varchar("notes", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shiftsRelations = relations(shifts, ({ one }) => ({
  user: one(users, {
    fields: [shifts.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [shifts.jobId],
    references: [jobs.id],
  }),
  employer: one(employers, {
    fields: [shifts.employerId],
    references: [employers.id],
  }),
}));

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  hoursWorked: z.coerce.number().min(0.25).max(24),
  hourlyWage: z.coerce.number().min(0),
  cashTips: z.coerce.number().min(0).optional(),
  creditTips: z.coerce.number().min(0).optional(),
  tipOut: z.coerce.number().min(0).max(100).optional(), // Percentage (0-100)
  coversServed: z.coerce.number().int().min(0).optional(),
  employerId: z.string().optional(),
});

export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;

// Employers table - tracks multiple employers/workplaces
export const employers = pgTable("employers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 20 }),
  managerName: varchar("manager_name", { length: 255 }),
  managerPhone: varchar("manager_phone", { length: 20 }),
  isActive: integer("is_active").default(1).notNull(), // 1 = active, 0 = archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employersRelations = relations(employers, ({ one }) => ({
  user: one(users, {
    fields: [employers.userId],
    references: [users.id],
  }),
}));

export const insertEmployerSchema = createInsertSchema(employers).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  businessName: z.string().min(1, "Business name is required").max(255),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  managerName: z.string().max(255).optional(),
  managerPhone: z.string().max(20).optional(),
});

export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type Employer = typeof employers.$inferSelect;

// Profile update schema with validation
export const updateProfileSchema = z.object({
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  username: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  // Accept URLs or base64 data URIs for profile images (max 100KB for base64)
  profileImageUrl: z.string().max(150000).optional().refine(
    (val) => !val || val === '' || val.startsWith('http') || val.startsWith('data:image/'),
    { message: "Must be a valid URL or data URI" }
  ),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  shifts: many(shifts),
  employers: many(employers),
}));
