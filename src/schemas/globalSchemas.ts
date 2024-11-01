import validator from "validator";
import z from "zod";

export const fullNameValidation = z
  .string()
  .regex(
    /^[\p{L}\p{M}.]+(?:\s+[\p{L}\p{M}.]+)+$/u,
    "Full name must be 2 words or more"
  )
  .max(100, "Full name must be less than 100 characters");

export const emailValidation = z
  .string()
  .email()
  .transform((val) => val.toLowerCase());

export const phoneNumberValidation = z.string().refine(validator.isMobilePhone);

export const passwordValidation = z.string().min(8);
