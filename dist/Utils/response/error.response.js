"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.TooManyRequestsException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ApplicationException = void 0;
const config_service_1 = require("../../Config/config.service");
class ApplicationException extends Error {
    statusCode;
    constructor(message, statusCode = 400, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationException = ApplicationException;
class BadRequestException extends ApplicationException {
    constructor(message, options) {
        super(message, 400, options);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends ApplicationException {
    constructor(message, options) {
        super(message, 404, options);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends ApplicationException {
    constructor(message, options) {
        super(message, 401, options);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends ApplicationException {
    constructor(message, options) {
        super(message, 403, options);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends ApplicationException {
    constructor(message, options) {
        super(message, 409, options);
    }
}
exports.ConflictException = ConflictException;
class TooManyRequestsException extends ApplicationException {
    constructor(message, options) {
        super(message, 429, options);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDev = config_service_1.env.MODE === "development";
    if (statusCode >= 500) {
        console.error(err);
    }
    res
        .status(statusCode)
        .json({
        message: err.message || "Internal Server Error",
        ...(isDev && { stack: err.stack }),
        cause: err.cause,
    });
};
exports.globalErrorHandler = globalErrorHandler;
