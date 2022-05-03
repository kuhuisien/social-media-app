import { IContext } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import { createJwtToken } from "../utils/createJwtToken";

interface ISignupAgrs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface ISigninAgrs {
  credentials: {
    email: string;
    password: string;
  };
}

interface IUserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: ISignupAgrs,
    { prisma }: IContext
  ): Promise<IUserPayload> => {
    const { email, password } = credentials;

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

    await prisma.profile.create({ data: { bio, userId: user.id } });

    return {
      userErrors: [],
      token: createJwtToken(user),
    };
  },

  signin: async (
    _: any,
    { credentials }: ISigninAgrs,
    { prisma }: IContext
  ): Promise<IUserPayload> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { userErrors: [{ message: "Invalid credential" }], token: null };
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return { userErrors: [{ message: "Invalid credential" }], token: null };
    }

    return {
      userErrors: [],
      token: createJwtToken(user),
    };
  },
};
