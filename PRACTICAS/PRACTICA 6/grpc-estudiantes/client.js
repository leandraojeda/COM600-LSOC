import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/estudiantes.proto";

// cargar proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// crear cliente
const client = new proto.UniversidadService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// ==========================================
// 1. REGISTRAR ESTUDIANTE
// ==========================================

client.AgregarEstudiante(
  {
    ci: "12345",
    nombres: "Carlos",
    apellidos: "Fernandez",
    carrera: "Ingeniería de Sistemas"
  },
  (err, response) => {

    if (err) return console.error(err);

    console.log("Estudiante agregado:");
    console.log(response.estudiante);

    // ==========================================
    // 2. REGISTRAR CURSO 1
    // ==========================================

    client.AgregarCurso(
      {
        codigo: "SIS101",
        nombre: "Programación",
        docente: "Ing. Pérez"
      },
      (err, responseCurso1) => {

        if (err) return console.error(err);

        console.log("\nCurso agregado:");
        console.log(responseCurso1.curso);

        // ==========================================
        // 3. REGISTRAR CURSO 2
        // ==========================================

        client.AgregarCurso(
          {
            codigo: "SIS102",
            nombre: "Bases de Datos",
            docente: "Ing. López"
          },
          (err, responseCurso2) => {

            if (err) return console.error(err);

            console.log("\nCurso agregado:");
            console.log(responseCurso2.curso);

            // ==========================================
            // 4. INSCRIBIR EN CURSO 1
            // ==========================================

            client.InscribirEstudiante(
              {
                ci: "12345",
                codigo: "SIS101"
              },
              (err, responseIns1) => {

                if (err) return console.error(err);

                console.log("\nInscripción:");
                console.log(responseIns1.mensaje);

                // ==========================================
                // 5. INSCRIBIR EN CURSO 2
                // ==========================================

                client.InscribirEstudiante(
                  {
                    ci: "12345",
                    codigo: "SIS102"
                  },
                  (err, responseIns2) => {

                    if (err) return console.error(err);

                    console.log("\nInscripción:");
                    console.log(responseIns2.mensaje);

                    // ==========================================
                    // 6. LISTAR CURSOS DEL ESTUDIANTE
                    // ==========================================

                    client.ListarCursosDeEstudiante(
                      { ci: "12345" },
                      (err, cursosResponse) => {

                        if (err) return console.error(err);

                        console.log("\nCursos del estudiante:");

                        console.log(cursosResponse.cursos);

                        // ==========================================
                        // 7. LISTAR ESTUDIANTES DEL CURSO
                        // ==========================================

                        client.ListarEstudiantesDeCurso(
                          { codigo: "SIS101" },
                          (err, estResponse) => {

                            if (err) return console.error(err);

                            console.log("\nEstudiantes del curso:");

                            console.log(estResponse.estudiantes);
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);