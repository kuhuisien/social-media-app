import { ApolloServer } from "apollo-server";
import { Query } from "./resolvers";
import { typeDefs } from "./schema";

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array.
const resolvers = {
  Query,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
