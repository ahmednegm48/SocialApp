"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.authentication = void 0;
const token_1 = require("../Utils/security/token");
const error_response_1 = require("../Utils/response/error.response");
const authentication = (tokenType = token_1.TokenEnum.ACCESS) => {
    return async (req, res, next) => {
        const { user, decoded } = await (0, token_1.decodeToken)({
            authorization: req.headers.authorization,
            tokenType,
        });
        req.user = user;
        req.decoded = decoded;
        next();
    };
};
exports.authentication = authentication;
const authorization = (accessRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !accessRoles.includes(req.user.role))
            throw new error_response_1.ForbiddenException("Not Authorized");
        next();
    };
};
exports.authorization = authorization;
