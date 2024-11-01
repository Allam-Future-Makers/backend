import express from "express";
import {
  validateLogin,
  validateRegister,
  validateResetPasswordConfirm,
  validateResetPasswordRequest,
  validateResetPasswordVerify,
  validateVerifyEmail,
} from "../validators/authValidators.js";
import authController from "../controllers/authController.js";

const router = express.Router();
router.post("/login", validateLogin, authController.login);
router.post(
  "/reset-password",
  validateResetPasswordRequest,
  authController.resetPasswordRequest
);
router.post(
  "/reset-password/verify",
  validateResetPasswordVerify,
  authController.resetPasswordVerify
);
router.post(
  "/reset-password/confirm",
  validateResetPasswordConfirm,
  authController.resetPasswordConfirm
);

router.post("/register", validateRegister, authController.register);
router.post("/verify", validateVerifyEmail, authController.verify);
router.post("/verify/resend", authController.verifyResend);
export default router;
