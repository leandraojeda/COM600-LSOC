// app.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/typeDefs');
const resolvers = require('./resolvers/ventasResolver');
const app = express();
// Montar el endpoint GraphQL en /graphql
app.use('/graphql', graphqlHTTP({
schema,
rootValue: resolvers, // Los resolvers responden a cada campo del schema
graphiql: true, // Habilitar GraphiQL (interfaz visual en el navegador)
}));
app.listen(4000, () => {
console.log('Servidor GraphQL corriendo en http://localhost:4000/graphql');
console.log('Abre tu navegador y navega a esa URL para usar GraphiQL');
});