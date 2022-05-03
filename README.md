# social-media-app-backend

This is a graphQL application built with Node.js (Apollo Server), prisma and PostgreSQL.
POstgreSQL is hosted in Heroku.

## Getting Started

1. Install dependencies at root directory.

```bash
npm install
```

### Running locally

1. Spin up a local development server. Open [http://localhost:4000](http://localhost:4000) to access graphQL playground

```bash
npm run start:dev
```

The page will reload if you make edits.

2. Database schema is defined in prisma/schema.prisma. To trigger database update referencing the schema, run the following command.

```bash
npx prisma db push
```

3. To access visual editor for the data in database, run the following command.

```bash
npx prisma studio
```

Then open [http://localhost:5555](http://localhost:5555) to view, edit or delete data in any tables in the database

## Reference Documentation

For further reference, please consider the following sections:

- [Official graphQL documentation](https://graphql.org/code/#javascript)
- [Apollo Server Reference Guide](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Reference Guide](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
