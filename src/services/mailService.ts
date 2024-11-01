import { Resend } from "resend";
import env from "../env.js";

const resend = new Resend(env.RESEND_API_KEY);
const sendingEmail = "FutureMakers <futuremakers@hossamohsen.me>";

const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  await resend.emails.send({
    from: sendingEmail,
    to: email,
    subject: "FutureMakers | Account Verification Code",
    html: `Welcome to FutureMakers! Your verification code is: <b>${verificationCode}</b>`,
  });
};

const sendPasswordResetEmail = async (
  email: string,
  verificationCode: string
) => {
  await resend.emails.send({
    from: sendingEmail,
    to: email,
    subject: "FutureMakers | Password Reset Code",
    html: `Hello! Your password reset code is: <b>${verificationCode}</b><br>If you didn't request this, please ignore this email.`,
  });
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
