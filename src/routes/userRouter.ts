import express from "express";
import exampleController from "../controllers/userController.js";
import { authTokenMiddleware } from "../middlewares/auth.js";

const router = express.Router();

export default router;
