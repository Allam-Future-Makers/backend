import validator from "validator";
import z from "zod";
import {
  emailValidation,
  fullNameValidation,
  phoneNumberValidation,
} from "./globalSchemas.js";
export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export const changeDataSchema = z.object({
  fullName: fullNameValidation.optional(),
  email: emailValidation.optional(),
  phoneNumber: phoneNumberValidation.optional(),
});
