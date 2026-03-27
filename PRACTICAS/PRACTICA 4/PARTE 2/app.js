// app.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/typeDefs');
const resolvers = require('./resolvers/inventarioResolver');
const app = express();
// Montar el endpoint GraphQL en /graphql
app.use('/graphql', graphqlHTTP({
schema,
rootValue: resolvers,
graphiql: true,
}));
app.listen(5000, () => {
console.log('Servidor GraphQL corriendo en http://localhost:5000/graphql');
console.log('Abre tu navegador y navega a esa URL para usar GraphiQL');
});