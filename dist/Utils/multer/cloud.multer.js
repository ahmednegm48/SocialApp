"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUpload = exports.uploadDir = exports.fileValidation = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
exports.fileValidation = {
    images: ["image/jpeg", "image/png", "image/jpg", "image/heic"],
    videos: ["video/mp4", "video/mkv", "video/avi"],
    audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};
exports.uploadDir = (0, path_1.resolve)("./uploads");
const cloudFileUpload = ({ validation = exports.fileValidation.images, maxSizeMB = 5, folder = "general", } = {}) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const ext = file.originalname.split(".").pop();
            cb(null, `${Date.now()}_${(0, crypto_1.randomUUID)()}.${ext}`);
        }
    });
};
exports.cloudFileUpload = cloudFileUpload;
