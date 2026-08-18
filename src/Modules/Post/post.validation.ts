import { z } from "zod";

export const createPostSchema = {
  body: z.strictObject({
    content: z.string().min(2).max(50000).optional(),
  }),
};

export const postIdParamsSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}),
  }),
};

export const upadtePostSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
  }),
};

export const createCommentSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
    parentId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}).optional(),
  }),
};

export const updateCommentSchema = {
  params: z.strictObject({
    commentId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
  }),
};

export const CommentIdParamsSchema = {
  params: z.strictObject({
    commentId: z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid ID Format"}),
  }),
};
