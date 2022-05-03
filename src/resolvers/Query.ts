import { IContext } from "..";

export const Query = {
  me: (_: any, __: any, { prisma, userInfo }: IContext) => {
    if (!userInfo) {
      return null;
    }

    return prisma.user.findUnique({ where: { id: userInfo.userId } });
  },

  posts: (_: any, __: any, { prisma }: IContext) => {
    return prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
  },
};
