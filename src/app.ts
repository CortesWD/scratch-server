/*
 * Dependencies
 */
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

/*
 * Others
 */
import resolvers from './graphql/resolvers.js';
import DiscogAPI from './datasource/discog-api.js';
import authRoutes from './controllers/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@scratch.qatqbxu.mongodb.net/${process.env.MONGO_DB_NAME}`;

const typeDefs = await readFile(path.join(__dirname, '/graphql', 'schema.graphql'), 'utf-8');

const app = express();

app.use(cors(), express.json());

/*
 * Controllers
 */
app.use('/user', authRoutes);

/*
 * MW Error
 */
app.use((error: any, req: any, res: any, next: any) => {
  console.log(error);
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({ message, data });
});

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

await mongoose.connect(MONGODB_URI);

app.listen({ port: process.env.PORT }, () => {
  console.log(`Server running on port ${process.env.PORT}:`);
  console.log(`Apollo running on port http://localhost:${process.env.PORT}/graphql`);
});

