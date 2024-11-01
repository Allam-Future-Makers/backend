import { validate } from "zod-express-validator";
import {
  changeDataSchema,
  changePasswordSchema,
} from "../schemas/userSchemas.js";

export const validateChangePassword = validate({ body: changePasswordSchema });
export type ChangePasswordController = typeof validateChangePassword;

export const validateChangeData = validate({ body: changeDataSchema });
export type ChangeDataController = typeof validateChangeData;
