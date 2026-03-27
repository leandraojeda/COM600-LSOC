const { buildSchema } = require('graphql');

const schema = buildSchema(`

  # ─────────── TIPOS DE DATOS ────────────────

  type Producto {
    id: Int
    nombre: String
    categoria: String
    stock_actual: Int
    precio: Float
    movimientos: [Movimiento]
  }

  type Proveedor {
    id: Int
    nombre: String
    telefono: String
    ciudad: String
  } 

  type Movimiento {
    id: Int
    producto_id: Int
    tipo: String
    cantidad: Int
    fecha: String
    observacion: String
  }

  # ─────────── INPUTS ────────────────

  # Input para crear un producto
  input ProductoInput {
    nombre: String!
    categoria: String!
    precio: Float!
  }

  # Input para registrar un movimiento 
  input MovimientoInput {
    producto_id: Int!
    tipo: String!
    cantidad: Int!
    fecha: String!
    observacion: String
  }

  # Input para actualizar un producto
  input ProductoUpdateInput {
    nombre: String
    categoria: String
    precio: Float
  }

  # Input para crear un proveedor
  input ProveedorInput {
    nombre: String!
    telefono: String
    ciudad: String
  }

  # Input para actualizar un proveedor
  input ProveedorUpdateInput {
    nombre: String
    telefono: String
    ciudad: String
  }

  # ─────────── QUERY ────────────────


  type Query {
    productos: [Producto]
    producto(id: Int!): Producto
    movimientos(producto_id: Int!): [Movimiento]

    proveedores: [Proveedor]
    proveedor(id: Int!): Proveedor
  }

  # ─────────── MUTATION ────────────────

  type Mutation {
    crearProducto(input: ProductoInput!): Producto
    registrarMovimiento(input: MovimientoInput!): Movimiento
    eliminarProducto(id: Int!): String

    crearProveedor(input: ProveedorInput!): Proveedor
    actualizarProveedor(id: Int!, input: ProveedorUpdateInput!): Proveedor
    eliminarProveedor(id: Int!): String
  }

`);

module.exports = schema;