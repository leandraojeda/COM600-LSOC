const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editorial: { type: String, required: true },
    año: { type: Number, required: true },
    descripcion: { type: String, required: true },
    numero_pagina: { type: Number, required: true },
});

module.exports = mongoose.model('Libro', libroSchema);