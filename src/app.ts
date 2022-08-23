import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';

import resolvers from './graphql/resolvers.js';
import DiscogAPI from './datasource/discog-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(), express.json());




const typeDefs = await readFile(path.join(__dirname, '/graphql', 'schema.graphql'), 'utf-8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      discogApi: new DiscogAPI()
    }
  },
});

await apolloServer.start();

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: process.env.PORT }, () => {
  console.log(`Server running on port ${process.env.PORT}:`);
  console.log(`Apollo running on port http://localhost:${process.env.PORT}/graphql`);
});

