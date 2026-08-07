"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginCredentials = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_enum_1 = require("../enums/user.enum");
const config_service_1 = require("../../Config/config.service");
const generateToken = ({ payload, secret, options, }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const createLoginCredentials = (user) => {
    const isAdmin = user.role === user_enum_1.RoleEnum.ADMIN;
    const accessSecret = isAdmin
        ? config_service_1.env.ACCESS_TOKEN_ADMIN_SECRET
        : config_service_1.env.ACCESS_TOKEN_USER_SECRET;
    const accessExpiration = isAdmin
        ? config_service_1.env.ACCESS_TOKEN_ADMIN_EXPIRATION
        : config_service_1.env.ACCESS_TOKEN_USER_EXPIRATION;
    const refreshSecret = isAdmin
        ? config_service_1.env.REFRESH_TOKEN_ADMIN_SECRET
        : config_service_1.env.REFRESH_TOKEN_USER_SECRET;
    const refreshExpiration = isAdmin
        ? config_service_1.env.REFRESH_TOKEN_ADMIN_EXPIRATION
        : config_service_1.env.REFRESH_TOKEN_USER_EXPIRATION;
    const accessToken = (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: accessSecret,
        options: { expiresIn: accessExpiration },
    });
    const refreshToken = (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: refreshSecret,
        options: { expiresIn: refreshExpiration },
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredentials = createLoginCredentials;
