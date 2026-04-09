const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const empleadosRouter = require('./routes/empleados');



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos

app.use('/empleados', empleadosRouter);



app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});


