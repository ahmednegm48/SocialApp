import { authentication } from "../../MiddleWare/authentication.middleware";
import { validation } from "../../MiddleWare/validation.middleware";
import UserService from "./user.service";
import * as validators from "./user.validation";
import { Router } from "express";

const router = Router();

router.use(authentication());

router.post(
  "/friend-request/:userId",
  validation(validators.userIdParamsSchema),
  UserService.sendFriendRequest
);

router.patch(
  "/friend-request/:requestId/accept",
  validation(validators.requestIdParamsSchema),
  UserService.acceptFriendRequest
);

router.delete(
  "/friend-request/:requestId/reject",
  validation(validators.requestIdParamsSchema),
  UserService.rejectFriendRequest
);

router.delete(
  "/friend/:userId",
  validation(validators.userIdParamsSchema),
  UserService.removeFriend
);

router.get(
  "/friend-request",
  UserService.listFriendRequest
);

router.patch(
  "/block/:userId",
  validation(validators.userIdParamsSchema),
  UserService.blockUser
);

router.patch(
  "/unblock/:userId",
  validation(validators.userIdParamsSchema),
  UserService.unblockUser
);


export default router;
