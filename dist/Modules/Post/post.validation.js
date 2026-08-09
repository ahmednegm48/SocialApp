"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdParamsSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = {
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
    }),
};
exports.postIdParamsSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid ID Format" }),
    }),
};
