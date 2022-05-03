import { IContext } from "../..";
import {
  POST_AUTHORIZATION_ERROR,
  POST_USER_NOT_FOUND_ERROR,
} from "../Mutation/post/constant";
import { IPostPayload } from "../Mutation/post/post.types";

interface ICanUserMutatePostParams {
  userId: number;
  postId: number;
  prisma: IContext["prisma"];
}

export const userMutatePostErrored = async ({
  userId,
  postId,
  prisma,
}: ICanUserMutatePostParams): Promise<IPostPayload | undefined> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { userErrors: [{ message: POST_USER_NOT_FOUND_ERROR }], post: null };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== userId) {
    return { userErrors: [{ message: POST_AUTHORIZATION_ERROR }], post: null };
  }
};
