import { Post } from "@prisma/client";
import { IContext } from "..";

interface IPostCreateArgs {
  title: string;
  content: string;
}

interface IPostPayload {
  userErrors: {
    message: string;
  }[];

  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _: any,
    { title, content }: IPostCreateArgs,
    { prisma }: IContext
  ): Promise<IPostPayload> => {
    if (!title || !content) {
      return {
        userErrors: [
          { message: "You must provide title and content to create a post" },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: { title, content, authorId: 1 },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
