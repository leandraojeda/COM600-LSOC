const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const schema = require('./schema/schema');
const resolvers = require('./resolvers/trabajadorResolver');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
require('dotenv').config();
const app = express ();
  const server = new ApolloServer({ typeDefs, resolvers });


mongoose.connect('mongodb://mongo:27017/trabajadores')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error:', err));

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
