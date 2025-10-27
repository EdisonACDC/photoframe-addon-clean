import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";
import { validateLicenseKey } from "@shared/license";

// Use UPLOAD_DIR from environment (set in run.sh to /data/uploads)
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  });
  app.use("/uploads", (await import("express")).static(UPLOAD_DIR));

  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error fetching photo:", error);
      res.status(500).json({ error: "Failed to fetch photo" });
    }
  });

  app.post("/api/photos/upload", upload.array("photos", 50), async (req, res) => {
    try {
      console.log("[UPLOAD] Inizio upload, UPLOAD_DIR:", UPLOAD_DIR);
      
      const files = req.files as Express.Multer.File[];
      console.log("[UPLOAD] File ricevuti:", files?.length || 0);
      
      if (!files || files.length === 0) {
        console.error("[UPLOAD] Nessun file ricevuto");
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log("[UPLOAD] Elaborazione file...");
      const uploadedPhotos = await Promise.all(
        files.map(async (file) => {
          console.log("[UPLOAD] File:", file.originalname, "→", file.filename);
          const photoData = insertPhotoSchema.parse({
            filename: file.originalname,
            filepath: `/uploads/${file.filename}`,
          });
          const photo = await storage.createPhoto(photoData);
          console.log("[UPLOAD] Foto salvata:", photo.id);
          return photo;
        })
      );

      console.log("[UPLOAD] Upload completato:", uploadedPhotos.length, "foto");
      res.json(uploadedPhotos);
    } catch (error) {
      console.error("[UPLOAD] ERRORE:", error);
      console.error("[UPLOAD] Stack:", error instanceof Error ? error.stack : "N/A");
      res.status(500).json({ 
        error: "Failed to upload photos",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      const filename = path.basename(photo.filepath);
      const filepath = path.join(UPLOAD_DIR, filename);
      try {
        await fs.unlink(filepath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }

      const deleted = await storage.deletePhoto(req.params.id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete photo" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  app.patch("/api/photos/:id/trash", async (req, res) => {
    try {
      const photo = await storage.moveToTrash(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error moving photo to trash:", error);
      res.status(500).json({ error: "Failed to move photo to trash" });
    }
  });

  app.patch("/api/photos/:id/restore", async (req, res) => {
    try {
      const photo = await storage.restoreFromTrash(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error restoring photo:", error);
      res.status(500).json({ error: "Failed to restore photo" });
    }
  });

  app.post("/api/photos/empty-trash", async (req, res) => {
    try {
      const deletedCount = await storage.emptyTrash();
      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Error emptying trash:", error);
      res.status(500).json({ error: "Failed to empty trash" });
    }
  });

  app.get("/api/slideshow/status", (req, res) => {
    res.json({ 
      playing: true,
      interval: 15 
    });
  });

  app.post("/api/slideshow/control", async (req, res) => {
    const { action, interval } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    res.json({ 
      success: true, 
      action,
      interval: interval || 15 
    });
  });

  app.get("/api/license", async (req, res) => {
    try {
      const key = await storage.getLicenseKey();
      const isValid = key ? validateLicenseKey(key) : false;
      
      // Se ha licenza PRO valida → isPro=true
      if (isValid) {
        return res.json({ 
          hasLicense: true,
          isValid: true,
          isPro: true,
          isTrial: false,
          isExpired: false,
          daysRemaining: 0
        });
      }
      
      // Nessuna licenza → controlla trial
      const firstLaunch = await storage.getFirstLaunchDate();
      if (!firstLaunch) {
        // Errore - dovrebbe sempre esserci
        return res.json({ 
          hasLicense: false,
          isValid: false,
          isPro: false,
          isTrial: false,
          isExpired: true,
          daysRemaining: 0
        });
      }
      
      const { calculateTrialDaysRemaining, isTrialExpired } = await import("@shared/license");
      const daysRemaining = calculateTrialDaysRemaining(firstLaunch);
      const expired = isTrialExpired(firstLaunch);
      
      res.json({ 
        hasLicense: false,
        isValid: false,
        isPro: false,
        isTrial: !expired, // Trial attivo solo se non scaduto
        isExpired: expired,
        daysRemaining
      });
    } catch (error) {
      console.error("Error checking license:", error);
      res.status(500).json({ error: "Failed to check license" });
    }
  });

  app.post("/api/license/activate", async (req, res) => {
    try {
      const { licenseKey } = req.body;
      
      if (!licenseKey || typeof licenseKey !== 'string') {
        return res.status(400).json({ error: "License key is required" });
      }

      const isValid = validateLicenseKey(licenseKey);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid license key" });
      }

      await storage.saveLicenseKey(licenseKey);
      
      console.log("[LICENSE] PRO attivata:", licenseKey);
      res.json({ 
        success: true,
        message: "Licenza PRO attivata con successo!",
        isPro: true
      });
    } catch (error) {
      console.error("Error activating license:", error);
      res.status(500).json({ error: "Failed to activate license" });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    app.post("/api/test/expire-trial", async (req, res) => {
      try {
        const { daysAgo } = req.body;
        const targetDays = typeof daysAgo === 'number' ? daysAgo : 11;
        const pastDate = new Date(Date.now() - targetDays * 24 * 60 * 60 * 1000);
        await storage.setFirstLaunchDate(pastDate);
        console.log(`[TEST] Trial scaduto impostato a ${targetDays} giorni fa:`, pastDate.toISOString());
        res.json({ success: true, firstLaunchDate: pastDate.toISOString() });
      } catch (error) {
        console.error("Error setting trial expiration:", error);
        res.status(500).json({ error: "Failed to set trial expiration" });
      }
    });

    app.post("/api/test/reset-trial", async (req, res) => {
      try {
        const now = new Date();
        await storage.setFirstLaunchDate(now);
        console.log("[TEST] Trial resettato a oggi:", now.toISOString());
        res.json({ success: true, firstLaunchDate: now.toISOString() });
      } catch (error) {
        console.error("Error resetting trial:", error);
        res.status(500).json({ error: "Failed to reset trial" });
      }
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}
