import { IContext } from "../..";

export const Query = {
  me: (_: any, __: any, { prisma, userInfo }: IContext) => {
    if (!userInfo) {
      return null;
    }

    return prisma.user.findUnique({ where: { id: userInfo.userId } });
  },

  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma, userInfo }: IContext
  ) => {
    const isMyProfile = Number(userId) === userInfo?.userId;

    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) {
      return null;
    }

    return { ...profile, isMyProfile };
  },

  posts: (_: any, __: any, { prisma }: IContext) => {
    return prisma.post.findMany({
      where: { published: true },
      orderBy: [{ createdAt: "desc" }],
    });
  },
};
