import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

export const createJwtToken = (user: User, expiresIn: number) => {
  return JWT.sign({ userId: user.id }, JSON_SIGNATURE, {
    expiresIn,
  });
};
