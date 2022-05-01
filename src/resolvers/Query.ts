import { IContext } from "..";

export const Query = {
  posts: (_: any, __: any, { prisma }: IContext) => {
    return prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
  },
};
