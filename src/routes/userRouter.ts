import express from "express";
import { authMiddlewares, authTokenMiddleware } from "../middlewares/auth.js";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddlewares, userController.getMe);

export default router;
