import { type Photo, type InsertPhoto } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getAllPhotos(): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: string): Promise<boolean>;
  moveToTrash(id: string): Promise<Photo | undefined>;
  restoreFromTrash(id: string): Promise<Photo | undefined>;
  emptyTrash(): Promise<number>;
  saveLicenseKey(key: string): Promise<void>;
  getLicenseKey(): Promise<string | null>;
  getFirstLaunchDate(): Promise<Date | null>;
  setFirstLaunchDate(date: Date): Promise<void>;
}

export class FileStorage implements IStorage {
  private photos: Map<string, Photo>;
  private dbPath: string;
  private uploadsDir: string;
  private licensePath: string;
  private firstLaunchPath: string;
  private licenseKey: string | null = null;
  private firstLaunchDate: Date | null = null;

  constructor(
    dbPath: string = "/data/photos.json", 
    uploadsDir: string = "/data/uploads", 
    licensePath: string = "/data/license.key",
    firstLaunchPath: string = "/data/first_launch.txt"
  ) {
    this.photos = new Map();
    this.dbPath = dbPath;
    this.uploadsDir = uploadsDir;
    this.licensePath = licensePath;
    this.firstLaunchPath = firstLaunchPath;
    this.init();
  }

  private async init() {
    try {
      console.log("[FileStorage] Inizializzazione storage persistente...");
      
      // Create uploads directory if not exists
      try {
        await fs.mkdir(this.uploadsDir, { recursive: true });
        console.log(`[FileStorage] Directory uploads: ${this.uploadsDir}`);
      } catch (err) {
        console.error("[FileStorage] Errore creazione uploads dir:", err);
      }

      // Load existing database
      try {
        const data = await fs.readFile(this.dbPath, "utf-8");
        const photosArray: Photo[] = JSON.parse(data);
        this.photos = new Map(photosArray.map(p => [p.id, p]));
        console.log(`[FileStorage] Database caricato: ${this.photos.size} foto`);
      } catch (err) {
        console.log("[FileStorage] Database non trovato, creazione nuovo...");
        await this.save();
      }

      // Scan uploads directory and sync with database
      await this.scanAndSync();

      // Clean up trashed photos on startup
      await this.cleanupTrashedPhotos();

      // Load license key
      await this.loadLicenseKey();

      // Load or create first launch date
      await this.loadFirstLaunchDate();
    } catch (error) {
      console.error("[FileStorage] Errore inizializzazione:", error);
    }
  }

  private async loadLicenseKey() {
    try {
      const key = await fs.readFile(this.licensePath, "utf-8");
      this.licenseKey = key.trim();
      console.log("[FileStorage] Licenza PRO caricata");
    } catch {
      console.log("[FileStorage] Nessuna licenza PRO trovata (versione FREE)");
      this.licenseKey = null;
    }
  }

  private async cleanupTrashedPhotos() {
    try {
      const trashedPhotos = Array.from(this.photos.values()).filter(p => p.inTrash);
      
      if (trashedPhotos.length === 0) {
        console.log("[FileStorage] Nessuna foto nel cestino da eliminare");
        return;
      }

      console.log(`[FileStorage] Eliminazione ${trashedPhotos.length} foto dal cestino...`);
      
      for (const photo of trashedPhotos) {
        try {
          const fullPath = path.join(this.uploadsDir, path.basename(photo.filepath));
          await fs.unlink(fullPath);
          this.photos.delete(photo.id);
          console.log(`[FileStorage] Eliminata: ${photo.filename}`);
        } catch (err) {
          console.error(`[FileStorage] Errore eliminazione ${photo.filename}:`, err);
        }
      }
      
      await this.save();
      console.log("[FileStorage] Pulizia cestino completata");
    } catch (error) {
      console.error("[FileStorage] Errore pulizia cestino:", error);
    }
  }

  private async scanAndSync() {
    try {
      console.log("[FileStorage] Scansione directory uploads...");
      const files = await fs.readdir(this.uploadsDir);
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      
      console.log(`[FileStorage] Trovati ${imageFiles.length} file immagine`);

      // Find orphaned files (files without metadata)
      const existingPaths = new Set(
        Array.from(this.photos.values()).map(p => path.basename(p.filepath))
      );

      const orphanedFiles = imageFiles.filter(f => !existingPaths.has(f));
      
      if (orphanedFiles.length > 0) {
        console.log(`[FileStorage] Recupero ${orphanedFiles.length} foto orfane...`);
        
        for (const filename of orphanedFiles) {
          const stats = await fs.stat(path.join(this.uploadsDir, filename));
          const photo: Photo = {
            id: randomUUID(),
            filename: filename,
            filepath: `/uploads/${filename}`,
            uploadedAt: stats.birthtime || new Date(),
            inTrash: false,
          };
          this.photos.set(photo.id, photo);
          console.log(`[FileStorage] Recuperata: ${filename}`);
        }
        
        await this.save();
      }

      // Remove metadata for deleted files
      const dbFilenames = Array.from(this.photos.values()).map(p => path.basename(p.filepath));
      const deletedFiles = dbFilenames.filter(f => !imageFiles.includes(f));
      
      if (deletedFiles.length > 0) {
        console.log(`[FileStorage] Rimozione ${deletedFiles.length} metadati obsoleti...`);
        const entries = Array.from(this.photos.entries());
        for (const [id, photo] of entries) {
          if (deletedFiles.includes(path.basename(photo.filepath))) {
            this.photos.delete(id);
          }
        }
        await this.save();
      }

      console.log(`[FileStorage] Sincronizzazione completata: ${this.photos.size} foto attive`);
    } catch (error) {
      console.error("[FileStorage] Errore scansione:", error);
    }
  }

  private async save() {
    try {
      const photosArray = Array.from(this.photos.values());
      await fs.writeFile(this.dbPath, JSON.stringify(photosArray, null, 2), "utf-8");
      console.log(`[FileStorage] Database salvato: ${photosArray.length} foto`);
    } catch (error) {
      console.error("[FileStorage] Errore salvataggio database:", error);
    }
  }

  async getAllPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      uploadedAt: new Date(),
      inTrash: false,
    };
    this.photos.set(id, photo);
    await this.save();
    return photo;
  }

  async deletePhoto(id: string): Promise<boolean> {
    const result = this.photos.delete(id);
    if (result) {
      await this.save();
    }
    return result;
  }

  async moveToTrash(id: string): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;
    
    photo.inTrash = true;
    this.photos.set(id, photo);
    await this.save();
    
    console.log(`[FileStorage] Foto spostata nel cestino: ${photo.filename}`);
    return photo;
  }

  async restoreFromTrash(id: string): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;
    
    photo.inTrash = false;
    this.photos.set(id, photo);
    await this.save();
    
    console.log(`[FileStorage] Foto ripristinata dal cestino: ${photo.filename}`);
    return photo;
  }

  async emptyTrash(): Promise<number> {
    const trashedPhotos = Array.from(this.photos.values()).filter(p => p.inTrash);
    let deleted = 0;
    
    for (const photo of trashedPhotos) {
      try {
        const fullPath = path.join(this.uploadsDir, path.basename(photo.filepath));
        await fs.unlink(fullPath);
        this.photos.delete(photo.id);
        deleted++;
        console.log(`[FileStorage] Eliminata dal cestino: ${photo.filename}`);
      } catch (err) {
        console.error(`[FileStorage] Errore eliminazione ${photo.filename}:`, err);
      }
    }
    
    if (deleted > 0) {
      await this.save();
    }
    
    console.log(`[FileStorage] Cestino svuotato: ${deleted} foto eliminate`);
    return deleted;
  }

  async saveLicenseKey(key: string): Promise<void> {
    try {
      await fs.writeFile(this.licensePath, key.trim(), "utf-8");
      this.licenseKey = key.trim();
      console.log("[FileStorage] Licenza PRO salvata");
    } catch (error) {
      console.error("[FileStorage] Errore salvataggio licenza:", error);
      throw error;
    }
  }

  async getLicenseKey(): Promise<string | null> {
    return this.licenseKey;
  }

  private async loadFirstLaunchDate() {
    try {
      const dateStr = await fs.readFile(this.firstLaunchPath, "utf-8");
      this.firstLaunchDate = new Date(dateStr.trim());
      console.log(`[FileStorage] First launch: ${this.firstLaunchDate.toISOString()}`);
    } catch {
      // First time launch - create timestamp
      this.firstLaunchDate = new Date();
      await this.setFirstLaunchDate(this.firstLaunchDate);
      console.log(`[FileStorage] Trial iniziato: ${this.firstLaunchDate.toISOString()}`);
    }
  }

  async getFirstLaunchDate(): Promise<Date | null> {
    return this.firstLaunchDate;
  }

  async setFirstLaunchDate(date: Date): Promise<void> {
    try {
      await fs.writeFile(this.firstLaunchPath, date.toISOString(), "utf-8");
      this.firstLaunchDate = date;
      console.log("[FileStorage] First launch date salvata");
    } catch (error) {
      console.error("[FileStorage] Errore salvataggio first launch:", error);
      throw error;
    }
  }
}

// Use local paths in development (Replit), /data in production (Home Assistant)
const UPLOAD_DIR = process.env.UPLOAD_DIR || (process.env.NODE_ENV === 'development' ? 'uploads' : '/data/uploads');
const DB_PATH = process.env.DB_PATH || (process.env.NODE_ENV === 'development' ? 'photos.json' : '/data/photos.json');
const LICENSE_PATH = process.env.LICENSE_PATH || (process.env.NODE_ENV === 'development' ? 'license.key' : '/data/license.key');
const FIRST_LAUNCH_PATH = process.env.FIRST_LAUNCH_PATH || (process.env.NODE_ENV === 'development' ? 'first_launch.txt' : '/data/first_launch.txt');

export const storage = new FileStorage(DB_PATH, UPLOAD_DIR, LICENSE_PATH, FIRST_LAUNCH_PATH);
