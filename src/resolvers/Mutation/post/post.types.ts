import { Post, Prisma } from "@prisma/client";

export interface IPostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

export interface IPostPayload {
  userErrors: {
    message: string;
  }[];

  post: Post | Prisma.Prisma__PostClient<Post> | null;
}
