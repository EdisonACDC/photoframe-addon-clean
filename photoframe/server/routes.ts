import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";
import { validateLicenseKey, isAdminLicense } from "@shared/license";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE || "2000");
const UPLOAD_LIMIT = parseInt(process.env.UPLOAD_LIMIT || "1000");

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: UPLOAD_LIMIT,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const express = await import("express");
  app.use(express.json({ limit: "2000mb" }));
  app.use(express.urlencoded({ limit: "2000mb", extended: true }));

  app.use("/uploads", express.static(UPLOAD_DIR));

  app.get("/api/photos", async (_req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.post("/api/photos/upload", upload.array("photos", UPLOAD_LIMIT), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files?.length) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploaded = await Promise.all(
        files.map((file) =>
          storage.createPhoto(
            insertPhotoSchema.parse({
              filename: file.originalname,
              filepath: `/uploads/${file.filename}`,
            })
          )
        )
      );

      res.json(uploaded);
    } catch (error) {
      res.status(500).json({ error: "Upload failed", details: String(error) });
    }
  });

  app.patch("/api/photos/:id/trash", async (req, res) => {
    try {
      const photo = await storage.moveToTrash(req.params.id);
      if (!photo) return res.status(404).json({ error: "Photo not found" });
      res.json(photo);
    } catch {
      res.status(500).json({ error: "Failed to move photo to trash" });
    }
  });

  // ✅ ✅ ✅ NUOVA ROTTA BULK
  app.post("/api/photos/bulk-trash", async (req, res) => {
    try {
      const { photoIds } = req.body;

      if (!Array.isArray(photoIds) || photoIds.length === 0) {
        return res.status(400).json({ error: "photoIds must be a non-empty array" });
      }

      const results = await Promise.all(
        photoIds.map((id: string) => storage.moveToTrash(id))
      );

      const moved = results.filter(Boolean).length;

      res.json({
        success: true,
        moved,
        requested: photoIds.length,
      });
    } catch (error) {
      console.error("[BULK TRASH ERROR]", error);
      res.status(500).json({ error: "Failed to move photos to trash" });
    }
  });

  app.post("/api/photos/empty-trash", async (_req, res) => {
    try {
      const deletedCount = await storage.emptyTrash();
      res.json({ success: true, deletedCount });
    } catch {
      res.status(500).json({ error: "Failed to empty trash" });
    }
  });

  app.patch("/api/photos/:id/restore", async (req, res) => {
    try {
      const photo = await storage.restoreFromTrash(req.params.id);
      if (!photo) return res.status(404).json({ error: "Photo not found" });
      res.json(photo);
    } catch {
      res.status(500).json({ error: "Failed to restore photo" });
    }
  });

  app.get("/api/license", async (_req, res) => {
    try {
      const key = await storage.getLicenseKey();
      const isValid = key ? validateLicenseKey(key) : false;

      if (isValid) {
        const isAdmin = key ? isAdminLicense(key) : false;
        return res.json({
          hasLicense: true,
          isValid: true,
          isPro: true,
          isExpired: false,
          daysRemaining: isAdmin ? -1 : 0,
        });
      }

      const firstLaunch = await storage.getFirstLaunchDate();
      res.json({
        hasLicense: false,
        isValid: false,
        isPro: false,
        isExpired: true,
        daysRemaining: 0,
      });
    } catch {
      res.status(500).json({ error: "License check failed" });
    }
  });

  return createServer(app);
}
