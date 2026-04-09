const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ['PLANIFICACION', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'],
    required: true,
    default: 'PLANIFICACION'
  },
  fechaInicio: { type: String, required: true },
  fechaFin: { type: String },
  presupuesto: { type: Number, required: true },
  empleadosIds: { type: [String], default: [] }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);