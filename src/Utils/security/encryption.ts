import crypto from "crypto";
import { env } from "../../Config/config.service.js";

const IV_LENGTH = 16;
const ENCRYOTION_SECRET_KEY = Buffer.from(env.ENC_KEY, "utf-8");

export const encrypt = (text: string): string => {
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYOTION_SECRET_KEY,
    iv,
  );

  let encryptedData:string = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decrypt = (encrytedData: string): string => {
  const [ivHex, encryptedText] = encrytedData.split(":");
  if(!ivHex || !encryptedText){
    throw new Error("Invalid encrypted data format");
  }
  const binaryLikeIV:Buffer = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYOTION_SECRET_KEY,
    binaryLikeIV,
  );

  let decryptedData:string = decipher.update(encryptedText, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
};
