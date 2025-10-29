import {
  users,
  jobs,
  shifts,
  type User,
  type UpsertUser,
  type Job,
  type InsertJob,
  type Shift,
  type InsertShift,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getJobs(userId: string): Promise<Job[]>;
  getJob(id: string, userId: string): Promise<Job | undefined>;
  createJob(userId: string, job: InsertJob): Promise<Job>;
  updateJob(id: string, userId: string, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: string, userId: string): Promise<void>;
  
  getShifts(userId: string): Promise<Shift[]>;
  getShift(id: string, userId: string): Promise<Shift | undefined>;
  createShift(userId: string, shift: InsertShift): Promise<Shift>;
  updateShift(id: string, userId: string, shift: Partial<InsertShift>): Promise<Shift>;
  deleteShift(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getJobs(userId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, userId))
      .orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string, userId: string): Promise<Job | undefined> {
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));
    return job;
  }

  async createJob(userId: string, jobData: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({ ...jobData, userId })
      .returning();
    return job;
  }

  async updateJob(id: string, userId: string, jobData: Partial<InsertJob>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set({ ...jobData, updatedAt: new Date() })
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)))
      .returning();
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async deleteJob(id: string, userId: string): Promise<void> {
    await db
      .delete(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));
  }

  async getShifts(userId: string): Promise<Shift[]> {
    return await db
      .select()
      .from(shifts)
      .where(eq(shifts.userId, userId))
      .orderBy(desc(shifts.date));
  }

  async getShift(id: string, userId: string): Promise<Shift | undefined> {
    const [shift] = await db
      .select()
      .from(shifts)
      .where(and(eq(shifts.id, id), eq(shifts.userId, userId)));
    return shift;
  }

  async createShift(userId: string, shiftData: InsertShift): Promise<Shift> {
    const [shift] = await db
      .insert(shifts)
      .values({ ...shiftData, userId })
      .returning();
    return shift;
  }

  async updateShift(id: string, userId: string, shiftData: Partial<InsertShift>): Promise<Shift> {
    const [shift] = await db
      .update(shifts)
      .set({ ...shiftData, updatedAt: new Date() })
      .where(and(eq(shifts.id, id), eq(shifts.userId, userId)))
      .returning();
    if (!shift) {
      throw new Error("Shift not found");
    }
    return shift;
  }

  async deleteShift(id: string, userId: string): Promise<void> {
    await db
      .delete(shifts)
      .where(and(eq(shifts.id, id), eq(shifts.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
