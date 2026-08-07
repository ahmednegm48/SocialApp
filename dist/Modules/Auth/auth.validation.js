"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.confirmEmailSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email({ error: "Invalid email address" }),
        password: zod_1.z
            .string({ error: "Password is required" })
            .min(8, { error: "Password must be at least 8 characters long" })
            .max(64, { error: "Password must be at most 64 characters long" }),
    }),
};
exports.confirmEmailSchema = {
    body: zod_1.z.strictObject({
        email: zod_1.z.email({ error: "Invalid email address" }),
        otp: zod_1.z.string().regex(/^\d{6}$/),
    }),
};
exports.signupSchema = {
    body: exports.loginSchema.body.extend({
        firstname: zod_1.z.string(),
        lastname: zod_1.z.string(),
        username: zod_1.z
            .string({ error: "Username is required" })
            .min(2, { error: "Username must be at least 2 characters long" })
            .max(25, { error: "Username must be at most 25 characters long" }),
        confirmPassword: zod_1.z
            .string({ error: "Password is required" })
            .min(8, { error: "Password must be at least 8 characters long" })
            .max(64, { error: "Password must be at most 64 characters long" }),
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match"
            });
        }
    }),
};
