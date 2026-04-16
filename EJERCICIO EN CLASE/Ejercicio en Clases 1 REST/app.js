const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const libroRoutes = require('./routes/libros');

const app = express();
//view ejs:
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

mongoose.connect('mongodb://mongo:27017/libro')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error:', err));

app.use('/libro', libroRoutes);
//los libros estan el /libro
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});