import { Post, Prisma } from "@prisma/client";
import { IContext } from "../..";

interface IPostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface IPostPayload {
  userErrors: {
    message: string;
  }[];

  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: IPostArgs,
    { prisma }: IContext
  ): Promise<IPostPayload> => {
    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [
          { message: "You must provide title and content to create a post" },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: { title, content, authorId: 1 },
      }),
    };
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: IPostArgs["post"] },
    { prisma }: IContext
  ): Promise<IPostPayload> => {
    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          { message: "You need to have at least one field to update post" },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!existingPost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    const payloadToUpdate = { title, content };
    if (!title) {
      delete payloadToUpdate.title;
    }
    if (!content) {
      delete payloadToUpdate.content;
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        data: { ...payloadToUpdate },
        where: { id: Number(postId) },
      }),
    };
  },

  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma }: IContext
  ): Promise<IPostPayload> => {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    await prisma.post.delete({ where: { id: Number(postId) } });

    return {
      userErrors: [],
      post,
    };
  },
};
