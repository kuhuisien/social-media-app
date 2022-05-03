import { IContext } from "../..";

interface IUserParentType {
  id: number;
}

export const User = {
  posts: ({ id }: IUserParentType, __: any, { prisma, userInfo }: IContext) => {
    const isOwnProfile = id === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: { authorId: id },
        orderBy: [{ createdAt: "desc" }],
      });
    } else {
      return prisma.post.findMany({
        where: { authorId: id, published: true },
        orderBy: [{ createdAt: "desc" }],
      });
    }
  },
};
