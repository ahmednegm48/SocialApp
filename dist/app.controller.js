"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootStrap = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_service_1 = require("./Config/config.service");
const cors_2 = require("./Utils/cors/cors");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_response_1 = require("./Utils/response/error.response");
const connection_1 = __importDefault(require("./DB/connection"));
const auth_controller_1 = __importDefault(require("./Modules/Auth/auth.controller"));
// import { HUserDocument, UserModel } from "./DB/Models/user.model";
const limitter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50,
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
const bootStrap = async () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)(), (0, cors_1.default)(cors_2.corsOptions), limitter);
    app.use(express_1.default.json());
    await (0, connection_1.default)();
    app.get("/", (req, res) => {
        return res.status(200).json({ message: "Welcome to Social App" });
    });
    app.use("/auth", auth_controller_1.default);
    // const user:HUserDocument = await new UserModel({
    //   firstName:"ahmed",
    //   lastName:"negm",
    //   email:"ahmednegm@gmail.com",
    //   password:"wala"
    // });
    // user.save()
    app.use((req, res) => {
        throw new error_response_1.NotFoundException("Route not found");
    });
    app.use(error_response_1.globalErrorHandler);
    app.listen(config_service_1.env.PORT, () => {
        console.log(`Server is running on port ${config_service_1.env.PORT}`);
    });
};
exports.bootStrap = bootStrap;
