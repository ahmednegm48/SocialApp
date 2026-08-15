"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdParamsSchema = exports.userIdParamsSchema = void 0;
const zod_1 = require("zod");
exports.userIdParamsSchema = {
    params: zod_1.z.strictObject({
        userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid ID Format" }),
    }),
};
exports.requestIdParamsSchema = {
    params: zod_1.z.strictObject({
        requestId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid ID Format" }),
    }),
};
