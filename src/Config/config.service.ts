import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve("./config/dev.env") });


export const env = {
    PORT: Number(process.env.PORT) || 3000,
    MODE: process.env.MODE || "DEVELOPMENT",
    APPLICATION_NAME: process.env.APPLICATION_NAME || "Social_App",
    DB_URI: process.env.DB_URI as string,
    SALT: Number(process.env.SALT),
    ENC_KEY: process.env.ENC_KEY as string,
    ACCESS_TOKEN_USER_SECRET: process.env.ACCESS_TOKEN_USER_SECRET as string,
    ACCESS_TOKEN_ADMIN_SECRET: process.env.ACCESS_TOKEN_ADMIN_SECRET as string,
    REFRESH_TOKEN_USER_SECRET: process.env.REFRESH_TOKEN_USER_SECRET as string,
    REFRESH_TOKEN_ADMIN_SECRET: process.env.REFRESH_TOKEN_ADMIN_SECRET as string,
    ACCESS_TOKEN_USER_EXPIRATION: Number(process.env.ACCESS_TOKEN_USER_EXPIRATION),
    ACCESS_TOKEN_ADMIN_EXPIRATION: Number(process.env.ACCESS_TOKEN_ADMIN_EXPIRATION), 
    REFRESH_TOKEN_USER_EXPIRATION: Number(process.env.REFRESH_TOKEN_USER_EXPIRATION),
    REFRESH_TOKEN_ADMIN_EXPIRATION: Number(process.env.REFRESH_TOKEN_ADMIN_EXPIRATION),
    REDIS_URL: process.env.REDIS_URL as string,
    WHITE_LIST: process.env.WHITE_LIST as string,
    EMAIL: process.env.EMAIL as string,
    PASSWORD: process.env.PASSWORD as string,
}

export type Env = typeof env;