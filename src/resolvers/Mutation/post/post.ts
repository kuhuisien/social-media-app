import { IContext } from "../../..";
import { userMutatePostErrored } from "../../utils/userMutatePostErrored";
import {
  POST_AUTHENTICATION_ERROR,
  POST_CREATION_INPUT_ERROR,
  POST_NOT_EXIST_ERROR,
  POST_UPDATE_INPUT_ERROR,
} from "./constant";
import { IPostArgs, IPostPayload } from "./post.types";

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: IPostArgs,
    { prisma, userInfo }: IContext
  ): Promise<IPostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: POST_AUTHENTICATION_ERROR }],
        post: null,
      };
    }

    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [{ message: POST_CREATION_INPUT_ERROR }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: { title, content, authorId: userInfo.userId },
      }),
    };
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: IPostArgs["post"] },
    { prisma, userInfo }: IContext
  ): Promise<IPostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: POST_AUTHENTICATION_ERROR }],
        post: null,
      };
    }

    const authorizationError = await userMutatePostErrored({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (authorizationError) {
      return authorizationError;
    }

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [{ message: POST_UPDATE_INPUT_ERROR }],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!existingPost) {
      return {
        userErrors: [{ message: POST_NOT_EXIST_ERROR }],
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
    { prisma, userInfo }: IContext
  ): Promise<IPostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: POST_AUTHENTICATION_ERROR }],
        post: null,
      };
    }

    const authorizationError = await userMutatePostErrored({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (authorizationError) {
      return authorizationError;
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return {
        userErrors: [{ message: POST_NOT_EXIST_ERROR }],
        post: null,
      };
    }

    await prisma.post.delete({ where: { id: Number(postId) } });

    return {
      userErrors: [],
      post,
    };
  },

  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: IContext
  ): Promise<IPostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: POST_AUTHENTICATION_ERROR }],
        post: null,
      };
    }

    const authorizationError = await userMutatePostErrored({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (authorizationError) {
      return authorizationError;
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        data: { published: true },
        where: { id: Number(postId) },
      }),
    };
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: IContext
  ): Promise<IPostPayload> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: POST_AUTHENTICATION_ERROR }],
        post: null,
      };
    }

    const authorizationError = await userMutatePostErrored({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (authorizationError) {
      return authorizationError;
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        data: { published: false },
        where: { id: Number(postId) },
      }),
    };
  },
};
