import {
  users,
  shifts,
  employers,
  type User,
  type UpsertUser,
  type Shift,
  type InsertShift,
  type Employer,
  type InsertEmployer,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  
  getShifts(userId: string): Promise<Shift[]>;
  getShift(id: string, userId: string): Promise<Shift | undefined>;
  createShift(userId: string, shift: InsertShift): Promise<Shift>;
  updateShift(id: string, userId: string, shift: Partial<InsertShift>): Promise<Shift>;
  deleteShift(id: string, userId: string): Promise<void>;
  
  getEmployers(userId: string): Promise<Employer[]>;
  getEmployer(id: string, userId: string): Promise<Employer | undefined>;
  createEmployer(userId: string, employer: InsertEmployer): Promise<Employer>;
  updateEmployer(id: string, userId: string, employer: Partial<InsertEmployer>): Promise<Employer>;
  deleteEmployer(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First, try to find user by email if email exists
    if (userData.email) {
      const existingUserByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      
      if (existingUserByEmail.length > 0 && existingUserByEmail[0].id !== userData.id) {
        // Update the existing user's ID to match the new OAuth sub
        const [updatedUser] = await db
          .update(users)
          .set({
            id: userData.id,
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        return updatedUser;
      }
    }

    // Otherwise, do normal upsert by ID
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

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getEmployers(userId: string): Promise<Employer[]> {
    return await db
      .select()
      .from(employers)
      .where(eq(employers.userId, userId))
      .orderBy(desc(employers.createdAt));
  }

  async getEmployer(id: string, userId: string): Promise<Employer | undefined> {
    const [employer] = await db
      .select()
      .from(employers)
      .where(and(eq(employers.id, id), eq(employers.userId, userId)));
    return employer;
  }

  async createEmployer(userId: string, employerData: InsertEmployer): Promise<Employer> {
    const [employer] = await db
      .insert(employers)
      .values({ ...employerData, userId })
      .returning();
    return employer;
  }

  async updateEmployer(id: string, userId: string, employerData: Partial<InsertEmployer>): Promise<Employer> {
    const [employer] = await db
      .update(employers)
      .set({ ...employerData, updatedAt: new Date() })
      .where(and(eq(employers.id, id), eq(employers.userId, userId)))
      .returning();
    if (!employer) {
      throw new Error("Employer not found");
    }
    return employer;
  }

  async deleteEmployer(id: string, userId: string): Promise<void> {
    await db
      .delete(employers)
      .where(and(eq(employers.id, id), eq(employers.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
