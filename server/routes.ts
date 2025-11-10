import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { insertGreetingSchema } from "@shared/schema";
import { z } from "zod";

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${nanoid()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const express = (await import("express")).default;
  app.use("/uploads", express.static("uploads"));

  app.post("/api/greetings", upload.array("photos", 12), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length < 2) {
        return res.status(400).json({ 
          error: "Please upload at least 2 photos" 
        });
      }

      const photoPaths = files.map(file => `/uploads/${file.filename}`);
      
      const bodyData = {
        recipientName: req.body.recipientName,
        recipientAge: parseInt(req.body.recipientAge, 10),
        photos: photoPaths,
      };

      const validatedData = insertGreetingSchema.parse(bodyData);
      const greeting = await storage.createGreeting(validatedData);

      res.json(greeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating greeting:", error);
      res.status(500).json({ error: "Failed to create greeting" });
    }
  });

  app.get("/api/greetings/:id", async (req, res) => {
    try {
      const greeting = await storage.getGreeting(req.params.id);
      
      if (!greeting) {
        return res.status(404).json({ error: "Greeting not found" });
      }

      res.json(greeting);
    } catch (error) {
      console.error("Error fetching greeting:", error);
      res.status(500).json({ error: "Failed to fetch greeting" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
