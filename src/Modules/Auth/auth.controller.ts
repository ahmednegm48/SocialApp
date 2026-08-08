import { validation } from "../../MiddleWare/validation.middleware";
import AuthService from "./auth.service";
import * as validators from "./auth.validation";
import { Router } from "express";

const router = Router();

router.post("/signup", validation(validators.signupSchema), AuthService.signup);
router.post("/login", validation(validators.loginSchema), AuthService.login);
router.patch(
  "/confirm-email",
  validation(validators.confirmEmailSchema),
  AuthService.confirmEmail,
);
router.patch(
  "/forget-password",
  validation(validators.forgetPasswordSchema),
  AuthService.forgetPassword,
);
router.patch(
  "/reset-password",
  validation(validators.resetPasswordSchema),
  AuthService.resetPassword,
);

export default router;
