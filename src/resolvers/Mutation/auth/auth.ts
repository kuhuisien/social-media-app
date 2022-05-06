import { IContext } from "../../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import { createJwtToken } from "../../utils/createJwtToken";
import { ISigninAgrs, ISignupAgrs, IUserPayload } from "./auth.types";
import {
  AUTH_BIO_INPUT_ERROR,
  AUTH_EMAIL_INPUT_ERROR,
  AUTH_NAME_INPUT_ERROR,
  AUTH_PASSWORD_INPUT_ERROR,
  AUTH_SIGN_IN_ERROR,
} from "./constant";

const EXPIRES_IN = 900;

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: ISignupAgrs,
    { prisma }: IContext
  ): Promise<IUserPayload> => {
    const { email, password } = credentials;

    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return {
        userErrors: [{ message: AUTH_EMAIL_INPUT_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    const isPasswordValid = validator.isLength(password, { min: 5 });
    if (!isPasswordValid) {
      return {
        userErrors: [{ message: AUTH_PASSWORD_INPUT_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    if (!name) {
      return {
        userErrors: [{ message: AUTH_NAME_INPUT_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    if (!bio) {
      return {
        userErrors: [{ message: AUTH_BIO_INPUT_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    await prisma.profile.create({ data: { bio, userId: user.id } });

    return {
      userErrors: [],
      token: createJwtToken(user, EXPIRES_IN),
      expiresIn: EXPIRES_IN,
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
      return {
        userErrors: [{ message: AUTH_SIGN_IN_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return {
        userErrors: [{ message: AUTH_SIGN_IN_ERROR }],
        token: null,
        expiresIn: 0,
      };
    }

    return {
      userErrors: [],
      token: createJwtToken(user, EXPIRES_IN),
      expiresIn: EXPIRES_IN,
    };
  },
};
