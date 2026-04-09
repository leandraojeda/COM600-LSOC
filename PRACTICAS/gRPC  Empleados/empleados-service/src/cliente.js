const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'empleado.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { empleadoPackage } = grpc.loadPackageDefinition(packageDef);

const client = new empleadoPackage.EmpleadoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 1. Crear empleado
client.CrearEmpleado(
  { nombres: 'Juan', apellidos: 'Perez', cargo: 'Desarrollador' },
  (err, response) => {
    if (err) return console.error('Error al crear:', err.message);
    console.log('Empleado creado:', response);

    // 2. Listar empleados
    client.ListarEmpleados({}, (err, response) => {
      if (err) return console.error('Error al listar:', err.message);
      console.log('Lista de empleados:', response.empleados);

      // 3. Eliminar el empleado recién creado
      client.EliminarEmpleado({ id: response.empleados[0].id }, (err, response) => {
        if (err) return console.error('Error al eliminar:', err.message);
        console.log('Resultado eliminar:', response);
      });
    });
  }
);
