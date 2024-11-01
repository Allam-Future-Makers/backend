import { validate } from "zod-express-validator";
import {
  confirmResetPasswordSchema,
  loginSchema,
  registerSchema,
  requestResetPasswordSchema,
  verifyEmailSchema,
  verifyResetPasswordSchema,
} from "../schemas/authSchemas.js";

export const validateLogin = validate({ body: loginSchema });
export type LoginController = typeof validateLogin;

export const validateRegister = validate({ body: registerSchema });
export type RegisterController = typeof validateRegister;

export const validateResetPasswordRequest = validate({
  body: requestResetPasswordSchema,
});
export type ResetPasswordRequestController =
  typeof validateResetPasswordRequest;

export const validateResetPasswordVerify = validate({
  body: verifyResetPasswordSchema,
});
export type ResetPasswordVerifyController = typeof validateResetPasswordVerify;

export const validateResetPasswordConfirm = validate({
  body: confirmResetPasswordSchema,
});
export type ResetPasswordConfirmController =
  typeof validateResetPasswordConfirm;

export const validateVerifyEmail = validate({ body: verifyEmailSchema });
export type VerifyEmailController = typeof validateVerifyEmail;
