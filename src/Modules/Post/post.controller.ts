import { authentication } from "../../MiddleWare/authentication.middleware";
import { validation } from "../../MiddleWare/validation.middleware";
import {
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer";
import postService from "./post.service";
import PostService from "./post.service";
import * as validators from "./post.validation";
import { Router } from "express";

const router = Router();

router.use(authentication());

router.post(
  "/",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.createPostSchema),
  PostService.createPost,
);

router.get(
  "/:postId",
  validation(validators.postIdParamsSchema),
  PostService.getPost,
);

router.patch(
  "/:postId/like",
  validation(validators.postIdParamsSchema),
  PostService.toggleLike,
);

router.patch(
  "/:postId/update",
  validation(validators.upadtePostSchema),
  PostService.updatePost,
);

router.delete(
  "/:postId/delete",
  validation(validators.postIdParamsSchema),
  PostService.updatePost,
);

router.post(
  "/:postId/comment",
  validation(validators.createCommentSchema),
  postService.createComments,
);

router.patch(
  "/comment/:commentId/update",
  validation(validators.updateCommentSchema),
  postService.updateComments,
);

router.delete(
  "/comment/:commentId/delete",
  validation(validators.CommentIdParamsSchema),
  postService.deleteComments,
);

export default router;
