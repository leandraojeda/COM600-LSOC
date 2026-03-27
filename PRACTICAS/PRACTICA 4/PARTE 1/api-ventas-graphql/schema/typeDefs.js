// schema/typeDefs.js
const { buildSchema } = require('graphql');
const schema = buildSchema(`
# ── Tipos de datos ───────────────────────────
type DetalleVenta {
id: Int
venta_id: Int
producto: String
cantidad: Int
precio_unitario: Float
}
type Venta {
id: Int
cliente: String
fecha: String
total: Float
detalle: [DetalleVenta] # Relación 1 a muchos
}
# ── Input para crear venta completa ──────────
input DetalleInput {
producto: String!
cantidad: Int!
precio_unitario: Float!
}
input VentaInput {
cliente: String!
fecha: String!
detalle: [DetalleInput!]!
}
# ── Input para modificar un item del detalle ─
input DetalleUpdateInput {
producto: String
cantidad: Int
precio_unitario: Float
}
# ── Queries (consultas) ───────────────────────
type Query {
ventas: [Venta] # Listar todas las ventas
venta(id: Int!): Venta # Obtener una venta con su detalle
}
# ── Mutations (escritura) ─────────────────────
type Mutation {
crearVenta(input: VentaInput!): Venta
modificarDetalleVenta(id: Int!, input: DetalleUpdateInput!): DetalleVenta
eliminarDetalleVenta(id: Int!): String
}
`);
module.exports = schema;