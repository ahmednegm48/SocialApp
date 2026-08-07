import { z } from "zod";

export const loginSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters long" })
      .max(64, { error: "Password must be at most 64 characters long" }),
  }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.email({ error: "Invalid email address" }),
    otp: z.string().regex(/^\d{6}$/),
  }),
};

export const signupSchema = {
  body: loginSchema.body.extend({
      firstname: z.string(),
      lastname: z.string(),
      username: z
        .string({ error: "Username is required" })
        .min(2, { error: "Username must be at least 2 characters long" })
        .max(25, { error: "Username must be at most 25 characters long" }),
      confirmPassword: z
        .string({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters long" })
        .max(64, { error: "Password must be at most 64 characters long" }),
    }).superRefine((data, ctx) => {
    if(data.password !== data.confirmPassword){
        ctx.addIssue({
            code:"custom",
            path:["confirmPassword"],
            message:"Passwords do not match"
        })
    }
  }),
};
