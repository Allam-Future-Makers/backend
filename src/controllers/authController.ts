import { Request, Response } from "express";
import {
  LoginController,
  RegisterController,
  ResetPasswordConfirmController,
  ResetPasswordRequestController,
  ResetPasswordVerifyController,
  VerifyEmailController,
} from "../validators/authValidators.js";
import { db } from "../db.js";
import { errors } from "../config/errors.js";
import argon2 from "argon2";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import env from "../env.js";
import { userModel } from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import { sha256, sixDigit } from "../utils/utils.js";
import mailService from "../services/mailService.js";

const generateToken = (user: User): [string, string] => {
  const tokenId = uuidv4();
  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
    jwtid: tokenId,
  });

  return [token, tokenId];
};

const login: LoginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw errors.invalidLogin;
  }

  const passValid = await argon2.verify(user.password, password);

  if (passValid !== true) {
    throw errors.invalidLogin;
  }

  const [token, tokenId] = await generateToken(user);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      tokenIds: {
        push: tokenId,
      },
    },
  });

  res.status(200).json({
    success: true,
    token,
    user: userModel(user),
  });
};

const resetPasswordRequest: ResetPasswordRequestController = async (
  req,
  res
) => {
  const { email } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    const code = sixDigit();
    const codeHash = sha256(code);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordIp: req.ip,
        resetPasswordToken: codeHash,
        resetPasswordRequestAt: new Date(),
        resetPasswordExpiry: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    mailService.sendPasswordResetEmail(user.email, code);
  }

  res.status(200).json({
    success: true,
  });
};

const resetPasswordVerify: ResetPasswordVerifyController = async (req, res) => {
  const { email, token } = req.body;

  let tokenHash = sha256(token);

  const user = await db.user.findUnique({
    where: { email: email },
  });

  if (!user || user.resetPasswordToken !== tokenHash) {
    throw errors.invalidResetPasswordToken;
  }

  if (user.resetPasswordExpiry! < new Date()) {
    throw errors.invalidResetPasswordToken;
  }

  res.status(200).json({ success: true });
};

const resetPasswordConfirm: ResetPasswordConfirmController = async (
  req,
  res
) => {
  const { password, token, email } = req.body;

  let tokenHash = sha256(token);

  const user = await db.user.findUnique({
    where: { email: email },
  });

  if (!user || user.resetPasswordToken !== tokenHash) {
    throw errors.invalidResetPasswordToken;
  }

  if (user.resetPasswordExpiry! < new Date()) {
    throw errors.invalidResetPasswordToken;
  }

  const hash = await argon2.hash(password);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      resetPasswordIp: null,
      lastPasswordChange: new Date(),
      tokenIds: [],
    },
  });

  res.status(200).json({ success: true });
};

const register: RegisterController = async (req, res) => {
  const { email, password, fullName } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    throw errors.userExists;
  }

  const hashedPassword = await argon2.hash(password);

  const verificationCode = sixDigit();
  const verificationCodeHash = sha256(verificationCode);

  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  });

  const [token, tokenId] = await generateToken(newUser);
  await db.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      tokenIds: {
        push: tokenId,
      },
      verificationToken: verificationCodeHash,
      verificationRequestAt: new Date(),
      verificationExpiry: new Date(Date.now() + 1000 * 60 * 15),
      verified: true,
    },
  });

  // mailService.sendVerificationEmail(newUser.email, verificationCode);

  res.status(201).json({
    success: true,
    token,
    user: userModel(newUser),
  });
};

const verify: VerifyEmailController = async (req, res) => {
  const { token } = req.body;

  const user = req.user;

  if (!user) {
    throw errors.unauthorized;
  }

  if (user.verified) {
    throw errors.alreadyVerified;
  }

  if (user.verificationToken !== sha256(token)) {
    throw errors.invalidVerification;
  }

  if (user.verificationExpiry! < new Date()) {
    throw errors.invalidVerification;
  }

  const [newToken, tokenId] = await generateToken(user);

  //remove the old partial token
  const newTokenIds = user.tokenIds.filter((id) => id !== req.auth);
  newTokenIds.push(tokenId);

  if (user.newEmail) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        newEmailVerified: true,
        email: user.newEmail,
        newEmail: null,
        tokenIds: {
          set: newTokenIds,
        },
      },
    });
  } else {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        tokenIds: {
          set: newTokenIds,
        },
      },
    });
  }

  res.status(200).json({
    success: true,
    token: newToken,
    ...userModel(user),
  });
};

const verifyResend = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw errors.unauthorized;
  }

  if (user.verified) {
    throw errors.alreadyVerified;
  }

  //check if 1 minute has passed since the last request
  if (user.verificationRequestAt! > new Date(Date.now() - 1000 * 60)) {
    throw errors.verificationRateLimit;
  }

  const verificationCode = sixDigit();
  const verificationCodeHash = sha256(verificationCode);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationToken: verificationCodeHash,
      verificationRequestAt: new Date(),
      verificationExpiry: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  mailService.sendVerificationEmail(user.email, verificationCode);

  res.status(200).json({
    success: true,
  });
};

export default {
  login,
  resetPasswordRequest,
  resetPasswordVerify,
  resetPasswordConfirm,
  register,
  verify,
  verifyResend,
};
