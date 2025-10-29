import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobSchema, insertShiftSchema, insertEmployerSchema, updateProfileSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/auth/user/tax-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { state, localTaxRate } = req.body;
      
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        ...currentUser,
        state: state !== undefined ? state : currentUser.state,
        localTaxRate: localTaxRate !== undefined ? localTaxRate.toString() : currentUser.localTaxRate,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating tax settings:", error);
      res.status(500).json({ message: "Failed to update tax settings" });
    }
  });

  app.get('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobs = await storage.getJobs(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const job = await storage.getJob(req.params.id, userId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertJobSchema.parse(req.body);
      const job = await storage.createJob(userId, validated);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.patch('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(req.params.id, userId, validated);
      res.json(job);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Job not found") {
        return res.status(404).json({ message: "Job not found" });
      }
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.delete('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteJob(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  app.get('/api/shifts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const shifts = await storage.getShifts(userId);
      res.json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ message: "Failed to fetch shifts" });
    }
  });

  app.get('/api/shifts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const shift = await storage.getShift(req.params.id, userId);
      if (!shift) {
        return res.status(404).json({ message: "Shift not found" });
      }
      res.json(shift);
    } catch (error) {
      console.error("Error fetching shift:", error);
      res.status(500).json({ message: "Failed to fetch shift" });
    }
  });

  app.post('/api/shifts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertShiftSchema.parse(req.body);
      const shift = await storage.createShift(userId, validated);
      res.status(201).json(shift);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating shift:", error);
      res.status(500).json({ message: "Failed to create shift" });
    }
  });

  app.patch('/api/shifts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertShiftSchema.partial().parse(req.body);
      const shift = await storage.updateShift(req.params.id, userId, validated);
      res.json(shift);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Shift not found") {
        return res.status(404).json({ message: "Shift not found" });
      }
      console.error("Error updating shift:", error);
      res.status(500).json({ message: "Failed to update shift" });
    }
  });

  app.delete('/api/shifts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteShift(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shift:", error);
      res.status(500).json({ message: "Failed to delete shift" });
    }
  });

  app.patch('/api/auth/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = updateProfileSchema.parse(req.body);
      
      // Build updates object - allow clearing optional fields
      const updates: any = {};
      
      // For name fields, only update if provided and not empty
      if (validated.firstName !== undefined && validated.firstName.trim() !== '') {
        updates.firstName = validated.firstName.trim();
      }
      if (validated.lastName !== undefined && validated.lastName.trim() !== '') {
        updates.lastName = validated.lastName.trim();
      }
      
      // For optional fields, allow clearing by sending empty string or null
      if (validated.username !== undefined) {
        updates.username = validated.username.trim() || null;
      }
      if (validated.zipCode !== undefined) {
        updates.zipCode = validated.zipCode.trim() || null;
      }
      
      const updatedUser = await storage.updateUserProfile(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/employers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const employers = await storage.getEmployers(userId);
      res.json(employers);
    } catch (error) {
      console.error("Error fetching employers:", error);
      res.status(500).json({ message: "Failed to fetch employers" });
    }
  });

  app.get('/api/employers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const employer = await storage.getEmployer(req.params.id, userId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      res.json(employer);
    } catch (error) {
      console.error("Error fetching employer:", error);
      res.status(500).json({ message: "Failed to fetch employer" });
    }
  });

  app.post('/api/employers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertEmployerSchema.parse(req.body);
      const employer = await storage.createEmployer(userId, validated);
      res.status(201).json(employer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating employer:", error);
      res.status(500).json({ message: "Failed to create employer" });
    }
  });

  app.patch('/api/employers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertEmployerSchema.partial().parse(req.body);
      const employer = await storage.updateEmployer(req.params.id, userId, validated);
      res.json(employer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Employer not found") {
        return res.status(404).json({ message: "Employer not found" });
      }
      console.error("Error updating employer:", error);
      res.status(500).json({ message: "Failed to update employer" });
    }
  });

  app.delete('/api/employers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteEmployer(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting employer:", error);
      res.status(500).json({ message: "Failed to delete employer" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
