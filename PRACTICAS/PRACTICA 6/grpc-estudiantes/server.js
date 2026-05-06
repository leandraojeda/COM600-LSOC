import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/estudiantes.proto";

// cargar proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// =======================
// BASE DE DATOS EN MEMORIA
// =======================

const estudiantes = [];
const cursos = [];
const inscripciones = [];

// =======================
// IMPLEMENTACIÓN SERVICIOS
// =======================

const serviceImpl = {

  // AGREGAR ESTUDIANTE
  AgregarEstudiante: (call, callback) => {

    const nuevo = call.request;

    estudiantes.push(nuevo);

    callback(null, {
      estudiante: nuevo
    });
  },

  // AGREGAR CURSO
  AgregarCurso: (call, callback) => {

    const nuevoCurso = call.request;

    cursos.push(nuevoCurso);

    callback(null, {
      curso: nuevoCurso
    });
  },

  // INSCRIBIR ESTUDIANTE
  InscribirEstudiante: (call, callback) => {

    const { ci, codigo } = call.request;

    // verificar si ya existe inscripción
    const existe = inscripciones.find(
      i => i.ci === ci && i.codigo === codigo
    );

    if (existe) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "El estudiante ya está inscrito en este curso"
      });
    }

    // verificar que estudiante exista
    const estudianteExiste = estudiantes.find(
      e => e.ci === ci
    );

    if (!estudianteExiste) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Estudiante no encontrado"
      });
    }

    // verificar que curso exista
    const cursoExiste = cursos.find(
      c => c.codigo === codigo
    );

    if (!cursoExiste) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Curso no encontrado"
      });
    }

    // guardar inscripción
    inscripciones.push({ ci, codigo });

    callback(null, {
      mensaje: "Inscripción realizada correctamente"
    });
  },

  // LISTAR CURSOS DE UN ESTUDIANTE
  ListarCursosDeEstudiante: (call, callback) => {

    const { ci } = call.request;

    const cursosInscritos = inscripciones
      .filter(i => i.ci === ci)
      .map(i => cursos.find(c => c.codigo === i.codigo));

    callback(null, {
      cursos: cursosInscritos
    });
  },

  // LISTAR ESTUDIANTES DE UN CURSO
  ListarEstudiantesDeCurso: (call, callback) => {

    const { codigo } = call.request;

    const estudiantesCurso = inscripciones
      .filter(i => i.codigo === codigo)
      .map(i => estudiantes.find(e => e.ci === i.ci));

    callback(null, {
      estudiantes: estudiantesCurso
    });
  }
};

// =======================
// CREAR SERVIDOR
// =======================

const server = new grpc.Server();

server.addService(
  proto.UniversidadService.service,
  serviceImpl
);

const PORT = "50051";

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {

    if (err) {
      console.error(err);
      return;
    }

    console.log(`Servidor gRPC ejecutándose en puerto ${port}`);

    server.start();
  }
);