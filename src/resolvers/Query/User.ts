import { IContext } from "../..";

interface IUserParentType {
  id: number;
}

export const User = {
  posts: ({ id }: IUserParentType, __: any, { prisma, userInfo }: IContext) => {
    const isOwnProfile = id === userInfo?.userId;

    // returns all posts belong to id, regardless it is published or not
    // (User can view his own posts, no matter it is published or not)
    if (isOwnProfile) {
      return prisma.post.findMany({
        where: { authorId: id },
        orderBy: [{ createdAt: "desc" }],
      });
    }
    // returns all posts belong to id, which is published
    else {
      return prisma.post.findMany({
        where: { authorId: id, published: true },
        orderBy: [{ createdAt: "desc" }],
      });
    }
  },
};
