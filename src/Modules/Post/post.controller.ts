import { authentication } from "../../MiddleWare/authentication.middleware";
import { validation } from "../../MiddleWare/validation.middleware";
import {
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer";
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
  PostService.createPost
);

router.patch(
  "/:postId/like",
  validation(validators.postIdParamsSchema),
  PostService.toggleLike
);

export default router;
