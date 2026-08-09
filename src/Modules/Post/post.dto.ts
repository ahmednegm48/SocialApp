import {z} from "zod";
import { createPostSchema, postIdParamsSchema } from "./post.validation";


export type ICreatePostDTO = z.infer<typeof createPostSchema.body>;
export type ITogglePostDTO = z.infer<typeof postIdParamsSchema.params>;