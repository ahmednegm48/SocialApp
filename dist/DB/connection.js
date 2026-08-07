"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_service_1 = require("../Config/config.service");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_service_1.env.DB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`connection error: ${error.message}`);
        throw error;
    }
};
exports.default = connectDB;
