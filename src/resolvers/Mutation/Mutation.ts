import { authResolvers } from "./auth";
import { postResolvers } from "./post/post";

export const Mutation = { ...postResolvers, ...authResolvers };
