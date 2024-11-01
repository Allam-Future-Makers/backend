import z from "zod";
import {
  emailValidation,
  fullNameValidation,
  passwordValidation,
  phoneNumberValidation,
} from "./globalSchemas.js";

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const registerSchema = z.object({
  fullName: fullNameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const requestResetPasswordSchema = z.object({
  email: emailValidation,
});

export const verifyResetPasswordSchema = z.object({
  email: emailValidation,
  token: z.string(),
});

export const confirmResetPasswordSchema = z.object({
  email: emailValidation,
  token: z.string(),
  password: passwordValidation,
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});
