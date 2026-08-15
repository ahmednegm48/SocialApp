import {z} from "zod";
import { createPostSchema, postIdParamsSchema, upadtePostSchema } from "./post.validation";


export type ICreatePostDTO = z.infer<typeof createPostSchema.body>;
export type IPostIdParamsDTO = z.infer<typeof postIdParamsSchema.params>;
export type IUpdatePostDTO = z.infer<typeof upadtePostSchema.body>;