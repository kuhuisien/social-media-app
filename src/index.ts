import { ApolloServer } from "apollo-server";
import { Mutation, Post, Profile, Query, User } from "./resolvers";
import { typeDefs } from "./schema";
import { Prisma, PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./resolvers/utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: { userId: number } | null;
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array.
const resolvers = {
  Query,
  Mutation,
  Profile,
  Post,
  User,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: any): Promise<IContext> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return { prisma, userInfo };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
