const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);
app.listen(3000, () => {
console.log('Servidor corriendo en puerto 3000');
});