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
  profileImageUrl: varchar("profile_image_url"),
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
  date: date("date").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }).notNull(),
  hourlyWage: decimal("hourly_wage", { precision: 8, scale: 2 }).notNull(),
  cashTips: decimal("cash_tips", { precision: 10, scale: 2 }).default('0').notNull(),
  creditTips: decimal("credit_tips", { precision: 10, scale: 2 }).default('0').notNull(),
  coversServed: integer("covers_served").default(0),
  tipOut: decimal("tip_out", { precision: 10, scale: 2 }).default('0').notNull(), // Amount shared with others
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
  tipOut: z.coerce.number().min(0).optional(),
  coversServed: z.coerce.number().int().min(0).optional(),
});

export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  shifts: many(shifts),
}));
