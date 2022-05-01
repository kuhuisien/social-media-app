import { IContext } from "../..";
import validator from "validator";

interface ISignupAgrs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

export const authResolvers = {
  signup: (
    _: any,
    { email, name, bio, password }: ISignupAgrs,
    { prisma }: IContext
  ) => {
    const isEmailValid = validator.isEmail(email);
  },
};
