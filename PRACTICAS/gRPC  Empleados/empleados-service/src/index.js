const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const db = require('./db');

const PROTO_PATH = path.join(__dirname, 'proto', 'empleado.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { empleadoPackage } = grpc.loadPackageDefinition(packageDef);

// Crear empleado
function CrearEmpleado(call, callback) {
  const { nombres, apellidos, cargo } = call.request;

  if (!nombres || !apellidos || !cargo) {
    return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Todos los campos son requeridos' });
  }

  db.query(
    'INSERT INTO empleados (nombres, apellidos, cargo) VALUES (?, ?, ?)',
    [nombres, apellidos, cargo],
    (err, result) => {
      if (err) return callback({ code: grpc.status.INTERNAL, message: err.message });

      db.query('SELECT * FROM empleados WHERE id = ?', [result.insertId], (err, rows) => {
        if (err) return callback({ code: grpc.status.INTERNAL, message: err.message });
        callback(null, rows[0]);
      });
    }
  );
}

// Listar empleados
function ListarEmpleados(_call, callback) {
  db.query('SELECT * FROM empleados', (err, rows) => {
    if (err) return callback({ code: grpc.status.INTERNAL, message: err.message });
    callback(null, { empleados: rows });
  });
}

// Eliminar empleado
function EliminarEmpleado(call, callback) {
  const { id } = call.request;

  db.query('SELECT * FROM empleados WHERE id = ?', [id], (err, rows) => {
    if (err) return callback({ code: grpc.status.INTERNAL, message: err.message });
    if (rows.length === 0) return callback({ code: grpc.status.NOT_FOUND, message: 'Empleado no encontrado' });

    db.query('DELETE FROM empleados WHERE id = ?', [id], (err) => {
      if (err) return callback({ code: grpc.status.INTERNAL, message: err.message });
      callback(null, { exito: true, mensaje: `Empleado con id ${id} eliminado correctamente` });
    });
  });
}

const server = new grpc.Server();

server.addService(empleadoPackage.EmpleadoService.service, {
  CrearEmpleado,
  ListarEmpleados,
  EliminarEmpleado,
});

const PORT = '0.0.0.0:50051';

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, _port) => {
  if (err) {
    console.error('Error al iniciar el servidor gRPC:', err);
    return;
  }
  console.log(`Servidor gRPC corriendo en ${PORT}`);
});
