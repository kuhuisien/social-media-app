import { authResolvers } from "./auth/auth";
import { postResolvers } from "./post/post";

export const Mutation = { ...postResolvers, ...authResolvers };
