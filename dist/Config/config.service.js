"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, path_1.resolve)("./config/dev.env") });
exports.env = {
    PORT: Number(process.env.PORT) || 3000,
    MODE: process.env.MODE || "DEVELOPMENT",
    APPLICATION_NAME: process.env.APPLICATION_NAME || "Social_App",
    DB_URI: process.env.DB_URI,
    SALT: Number(process.env.SALT),
    ENC_KEY: process.env.ENC_KEY,
    ACCESS_TOKEN_USER_SECRET: process.env.ACCESS_TOKEN_USER_SECRET,
    ACCESS_TOKEN_ADMIN_SECRET: process.env.ACCESS_TOKEN_ADMIN_SECRET,
    REFRESH_TOKEN_USER_SECRET: process.env.REFRESH_TOKEN_USER_SECRET,
    REFRESH_TOKEN_ADMIN_SECRET: process.env.REFRESH_TOKEN_ADMIN_SECRET,
    ACCESS_TOKEN_USER_EXPIRATION: Number(process.env.ACCESS_TOKEN_USER_EXPIRATION),
    ACCESS_TOKEN_ADMIN_EXPIRATION: Number(process.env.ACCESS_TOKEN_ADMIN_EXPIRATION),
    REFRESH_TOKEN_USER_EXPIRATION: Number(process.env.REFRESH_TOKEN_USER_EXPIRATION),
    REFRESH_TOKEN_ADMIN_EXPIRATION: Number(process.env.REFRESH_TOKEN_ADMIN_EXPIRATION),
    REDIS_URL: process.env.REDIS_URL,
    WHITE_LIST: process.env.WHITE_LIST,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
};
