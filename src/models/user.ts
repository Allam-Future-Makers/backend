import { User } from "@prisma/client";

export const userModel = (user: User) => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    verified: user.verified,
    newEmailVerified: user.newEmailVerified,
    newEmail: user.newEmail,
  };
};
