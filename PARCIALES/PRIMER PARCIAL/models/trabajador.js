const mongoose = require('mongoose');

const trabajadorSchema = new mongoose.Schema({
    
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    ci: { type: Number, required: true,  },
    departamento: { type: String, required: true },
    cargo: { type: String, required: true },
    fechadeingreso: { type: Date, required: true },
});

module.exports = mongoose.model('Trabajador', trabajadorSchema);