"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcrypt_1 = require("bcrypt");
const config_service_1 = require("../../Config/config.service");
const generateHash = async (plaintext, saltRounds = config_service_1.env.SALT) => {
    return await (0, bcrypt_1.hash)(plaintext, saltRounds);
};
exports.generateHash = generateHash;
const compareHash = async (plaintext, hashed) => {
    return await (0, bcrypt_1.compare)(plaintext, hashed);
};
exports.compareHash = compareHash;
