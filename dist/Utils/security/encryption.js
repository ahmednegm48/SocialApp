"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_service_js_1 = require("../../Config/config.service.js");
const IV_LENGTH = 16;
const ENCRYOTION_SECRET_KEY = Buffer.from(config_service_js_1.env.ENC_KEY, "utf-8");
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", ENCRYOTION_SECRET_KEY, iv);
    let encryptedData = cipher.update(text, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv.toString("hex")}:${encryptedData}`;
};
exports.encrypt = encrypt;
const decrypt = (encrytedData) => {
    const [ivHex, encryptedText] = encrytedData.split(":");
    if (!ivHex || !encryptedText) {
        throw new Error("Invalid encrypted data format");
    }
    const binaryLikeIV = Buffer.from(ivHex, "hex");
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", ENCRYOTION_SECRET_KEY, binaryLikeIV);
    let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
};
exports.decrypt = decrypt;
