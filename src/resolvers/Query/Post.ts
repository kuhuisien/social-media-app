import { IContext } from "../..";

interface IPostParentType {
  authorId: number;
}

export const Post = {
  user: ({ authorId }: IPostParentType, __: any, { prisma }: IContext) => {
    return prisma.user.findUnique({ where: { id: authorId } });
  },
};
