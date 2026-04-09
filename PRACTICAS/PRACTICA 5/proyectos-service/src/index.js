const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

async function start() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rrhh_proyectos');
  console.log('Conectado a MongoDB');

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3002 }
  });

  console.log(`Servicio Proyectos corriendo en ${url}`);
}

start().catch(console.error);