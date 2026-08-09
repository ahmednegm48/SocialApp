"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localFileUpload = exports.uploadDir = exports.fileValidation = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const error_response_1 = require("../response/error.response");
exports.fileValidation = {
    images: ["image/jpeg", "image/png", "image/jpg", "image/heic"],
    videos: ["video/mp4", "video/mkv", "video/avi"],
    audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
    documents: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
};
exports.uploadDir = (0, path_1.resolve)("./uploads");
const localFileUpload = ({ validation = exports.fileValidation.images, maxSizeMB = 5, folder = "general", } = {}) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const destPath = (0, path_1.resolve)(exports.uploadDir, folder);
            if (!(0, fs_1.existsSync)(destPath)) {
                (0, fs_1.mkdirSync)(destPath, { recursive: true });
            }
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const ext = file.originalname.split(".").pop();
            cb(null, `${Date.now()}_${(0, crypto_1.randomUUID)()}.${ext}`);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (!validation.includes(file.mimetype)) {
            return cb(new error_response_1.BadRequestException(`Invalid File Format: ${file.mimetype}`));
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
    });
};
exports.localFileUpload = localFileUpload;
