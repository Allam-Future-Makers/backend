import express, { Request, Response } from "express";
import { store } from "../context.js";
import { userModel } from "../models/user.js";

const getMe = async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    ...userModel(user!),
  });
};

export default {
  getMe,
};
