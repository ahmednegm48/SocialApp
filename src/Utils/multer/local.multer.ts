import { randomUUID } from "crypto";
import { Request } from "express";
import { resolve } from "path";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { existsSync, mkdirSync } from "fs";
import { BadRequestException } from "../response/error.response";

export const fileValidation = {
  images: ["image/jpeg", "image/png", "image/jpg", "image/heic"],
  videos: ["video/mp4", "video/mkv", "video/avi"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const uploadDir = resolve("./uploads");

export const localFileUpload = ({
  validation = fileValidation.images,
  maxSizeMB = 5,
  folder = "general",
}: {
  validation?: string[];
  maxSizeMB?: number;
  folder?: string;
} = {}) => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const destPath = resolve(uploadDir, folder);
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }
      cb(null, destPath);
    },
    filename: (req: Request, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}_${randomUUID()}.${ext}`);
    },
  });
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new BadRequestException(`Invalid File Format: ${file.mimetype}`),
      );
    }
    cb(null, true);
  };
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
