import { IContext } from "../..";

interface IProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: ({ userId }: IProfileParentType, __: any, { prisma }: IContext) => {
    return prisma.user.findUnique({ where: { id: userId } });
  },
};
