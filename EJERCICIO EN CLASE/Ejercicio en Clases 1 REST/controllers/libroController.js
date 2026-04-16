const Libro = require('../models/Libro');
// 1. GET todos los libros (API)
exports.getAll = async (req, res) => {
  try {
    const libro = await Libro.find();
    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los libros");
  }
};

// 2. POST crear libro (API)
exports.create = async (req, res) => {
  try {
    const { titulo, autor, editorial, año, descripcion, numero_pagina } = req.body;
    const nuevoLibro = new Libro({ titulo, autor, editorial, año, descripcion, numero_pagina });
    await nuevoLibro.save();
    res.json(nuevoLibro);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear libro");
  }
};

// 3. PUT actualizar libro (API)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, editorial, año, descripcion, numero_pagina } = req.body;
    const libro = await Libro.findByIdAndUpdate(id, {
      titulo, autor, editorial, año, descripcion, numero_pagina
    }, { new: true });
    
    if (!libro) {
      return res.status(404).send("El libro no existe");
    }
    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error al actualizar libro");
  }
};

// 4. DELETE eliminar libro (API)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Libro.findByIdAndDelete(id);
    res.send("libro eliminado");
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al eliminar libro');
  }
};

// VISTAS EJS

// Mostrar lista
exports.showAll = async (req, res) => {
  try {
    const libros = await Libro.find();
    console.log('Libros encontrados:', libros);  // ← Agrega esto
    res.render('index', { libros });
  } catch (error) {
    console.log('Error:', error);  // ← Agrega esto
    res.status(500).send('Error al obtener libros');
  }
};

// Mostrar formulario crear
exports.showCreate = (req, res) => {
  res.render('create');
};

// Crear libro (desde formulario)
exports.createView = async (req, res) => {
  try {
    const { titulo, autor, editorial, año, descripcion, numero_pagina } = req.body;
    const nuevoLibro = new Libro({ titulo, autor, editorial, año, descripcion, numero_pagina });
    await nuevoLibro.save();
    res.redirect('/libro');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear libro");
  }
};

// Mostrar detalle
exports.show = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).send('Libro no encontrado');
    res.render('show', { libro });
  } catch (error) {
    res.status(500).send('Error al obtener libro');
  }
};

// Mostrar formulario editar
exports.showEdit = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).send('Libro no encontrado');
    res.render('edit', { libro });
  } catch (error) {
    res.status(500).send('Error al obtener libro');
  }
};

// Actualizar libro (desde formulario)
exports.updateView = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, editorial, año, descripcion, numero_pagina } = req.body;
    await Libro.findByIdAndUpdate(id, {
      titulo, autor, editorial, año, descripcion, numero_pagina
    }, { new: true });
    res.redirect('/libro');
  } catch (error) {
    console.error(error);
    res.status(400).send("Error al actualizar libro");
  }
};

// Eliminar libro (desde formulario)
exports.deleteView = async (req, res) => {
  try {
    const { id } = req.params;
    await Libro.findByIdAndDelete(id);
    res.redirect('/libro');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al eliminar libro');
  }
};