import { authentication } from "../../MiddleWare/authentication.middleware";
import CommentService from "./comment.service";
import * as validators from "./comment.validation";
import { Router } from "express";

const router = Router();

router.use(authentication());

export default router;
