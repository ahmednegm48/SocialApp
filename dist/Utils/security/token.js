"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.createLoginCredentials = exports.verifyToken = exports.generateToken = exports.TokenEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../../DB/Models/user.model");
const user_enum_1 = require("../enums/user.enum");
const config_service_1 = require("../../Config/config.service");
const error_response_1 = require("../response/error.response");
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["ACCESS"] = "access";
    TokenEnum["REFRESH"] = "refresh";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
const generateToken = ({ payload, secret, options, }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = ({ token, secret, }) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
const getSignature = (type, role) => {
    const isAdmin = role === user_enum_1.RoleEnum.ADMIN;
    if (type === TokenEnum.ACCESS) {
        const Secret = isAdmin
            ? config_service_1.env.ACCESS_TOKEN_ADMIN_SECRET
            : config_service_1.env.ACCESS_TOKEN_USER_SECRET;
        const Expiration = isAdmin
            ? config_service_1.env.ACCESS_TOKEN_ADMIN_EXPIRATION
            : config_service_1.env.ACCESS_TOKEN_USER_EXPIRATION;
        return { Secret, Expiration };
    }
    const Secret = isAdmin
        ? config_service_1.env.REFRESH_TOKEN_ADMIN_SECRET
        : config_service_1.env.REFRESH_TOKEN_USER_SECRET;
    const Expiration = isAdmin
        ? config_service_1.env.REFRESH_TOKEN_ADMIN_EXPIRATION
        : config_service_1.env.REFRESH_TOKEN_USER_EXPIRATION;
    return { Secret, Expiration };
};
const createLoginCredentials = (user) => {
    const payload = { _id: user._id.toString() };
    const access = getSignature(TokenEnum.ACCESS, user.role);
    const refresh = getSignature(TokenEnum.REFRESH, user.role);
    const accessToken = (0, exports.generateToken)({
        payload,
        secret: access.Secret,
        options: { expiresIn: access.Expiration },
    });
    const refreshToken = (0, exports.generateToken)({
        payload,
        secret: refresh.Secret,
        options: { expiresIn: refresh.Expiration },
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredentials = createLoginCredentials;
const decodeToken = async ({ authorization, tokenType = TokenEnum.ACCESS, }) => {
    if (!authorization)
        throw new error_response_1.UnauthorizedException("you are not Authorized");
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token)
        throw new error_response_1.UnauthorizedException("Invalid token Format");
    let decoded;
    try {
        decoded = (0, exports.verifyToken)({
            token,
            secret: getSignature(tokenType, user_enum_1.RoleEnum.USER).Secret,
        });
    }
    catch {
        try {
            decoded = (0, exports.verifyToken)({
                token,
                secret: getSignature(tokenType, user_enum_1.RoleEnum.ADMIN).Secret,
            });
        }
        catch {
            throw new error_response_1.UnauthorizedException("Invalid or expired token");
        }
    }
    if (!decoded._id) {
        throw new error_response_1.UnauthorizedException("Invalid Token Payload");
    }
    const user = await user_model_1.UserModel.findById(decoded._id);
    if (!user)
        throw new error_response_1.NotFoundException("Account Not Found");
    return { user, decoded };
};
exports.decodeToken = decodeToken;
