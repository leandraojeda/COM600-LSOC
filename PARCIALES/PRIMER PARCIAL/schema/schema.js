const typeDefs = `#graphql

  type Trabajador {
    id: ID!
    nombre: String!
    apellido: String
    ci: Int!
    cargo: String!
    departamento: String!
    fecha_ingreso: Date!
 
  }

  input TrabajadorInput {
    nombre: String!
    apellido: String!
    ci: String!
    cargo: String!
    departamento: String!
    fecha_ingreso: Date!
  }

  type Query {
    trabajador: [trabajador!]!
    trabajador(id: ID!): trabajador
  }
  type Mutation {
    crearTrabajador(input: TrabajadorInput!): Trabajador!
    actualizarTrabajador(id: ID!, input: TrabajadorInput!): Trabajador!
    eliminarTRabajador (id: ID!): Boolean!
  }
`;

module.exports = typeDefs;