import AppError from "../models/error.js";
export const errorCodes = {
  unexpected: 1999,
  notFound: 1000,
  validation: 1001,
} as const;

export const errors = {
  notFound: AppError.custom(404, errorCodes.notFound, "Not found"),
  unexpected: AppError.custom(
    500,
    errorCodes.unexpected,
    "Something went wrong"
  ),
  invalidAuth: AppError.custom(401, 1002, "Invalid token."),
  unauthorized: AppError.custom(403, 1003, "Unauthorized."),
  invalidLogin: AppError.custom(400, 1004, "Invalid email or password."),
  userExists: AppError.custom(400, 1005, "Email or Phone number already used."),
  alreadyVerified: AppError.custom(400, 1006, "User already verified."),
  invalidVerification: AppError.custom(
    400,
    1007,
    "Verification code invalid or expired."
  ),
  verificationRateLimit: AppError.custom(
    400,
    1008,
    "Please wait for 1 minute before requesting another verification code."
  ),
  invalidResetPasswordToken: AppError.custom(
    400,
    1009,
    "Invalid or expired code."
  ),
} as const;
