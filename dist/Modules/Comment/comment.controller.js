"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_middleware_1 = require("../../MiddleWare/authentication.middleware");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use((0, authentication_middleware_1.authentication)());
exports.default = router;
