import { IContext } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

interface ISignupAgrs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface IUserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, bio, password }: ISignupAgrs,
    { prisma }: IContext
  ): Promise<IUserPayload> => {
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return { userErrors: [{ message: "Invalid email" }], token: null };
    }

    const isPasswordValid = validator.isLength(password, { min: 5 });
    if (!isPasswordValid) {
      return {
        userErrors: [
          { message: "Password must contain at least five characters" },
        ],
        token: null,
      };
    }

    if (!name) {
      return {
        userErrors: [{ message: "Name is empty" }],
        token: null,
      };
    }

    if (!bio) {
      return {
        userErrors: [{ message: "Bio is empty" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const token = await JWT.sign({ userId: user.id }, JSON_SIGNATURE, {
      expiresIn: 300,
    });

    await prisma.profile.create({ data: { bio, userId: user.id } });

    return { userErrors: [], token };
  },
};
