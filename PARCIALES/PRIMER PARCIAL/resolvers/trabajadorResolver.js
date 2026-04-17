const Trabajador = require('../models/trabajador');

const resolvers = {
  Query: {
    Trabajador: async () => await Trabajador.find(),

    Trabajador: async (_, { id }) => await Trabajador.findById(id),

   
  },

  Mutation: {
    crearTrabajador: async (_, { input }) => {
      const trabajador = new Trabajador(input);
      return await trabajador.save();
    },

    actualizarTrabajador: async (_, { id, input }) => {
      return await Proyecto.findByIdAndUpdate(id, input, { new: true });
    },

   

    eliminarTrabajador: async (_, { id }) => {
      const result = await Proyecto.findByIdAndDelete(id);
      return !!result;
    },
  },
};

module.exports = resolvers;