import { IContext } from "../..";
import { userLoader } from "../../loaders/userLoader";

interface IPostParentType {
  authorId: number;
}

export const Post = {
  user: ({ authorId }: IPostParentType, __: any, { prisma }: IContext) => {
    return userLoader.load(authorId);
  },
};
