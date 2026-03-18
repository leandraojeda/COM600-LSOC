const db = require('../db');


//GET todos y EDAD
exports.getAll = (req, res) => {
  const edad = req.query.edad;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM usuarios WHERE 1=1';
  const params = [];
  
  if (edad) {
    query += ' AND edad = ?';
    params.push(edad);
  }
  
  query += ' LIMIT ' + limit + ' OFFSET ' + offset;
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        transaccion: false,
        mensaje: 'Error en la consulta',
        data: {}
      });
    }
    res.json({
      transaccion: true,
      mensaje: 'Usuarios OBTENIDOS',
      data: results
    });
  });
};
// GET por ID
exports.getById = (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        transaccion: false,
        mensaje: 'Error en la consulta',
        data: {}
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        transaccion: false,
        mensaje: 'Usuario no encontrado',
        data: {}
      });
    }
    res.json({
      transaccion: true,
      mensaje: 'Usuario OBTENIDO',
      data: results[0]
    });
  });
};


// POST crear
exports.create = (req, res) => {
  const { nombre, email, edad } = req.body;
  
  if (!email || edad <= 0) {
    return res.status(400).json({
      transaccion: false,
      mensaje: 'Email obligatorio y edad mayor a 0',
      data: {}
    });
  }
  
  db.query(
    'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)',
    [nombre, email, edad],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          transaccion: false,
          mensaje: 'Error al crear usuario',
          data: {}
        });
      }
      res.status(201).json({
        transaccion: true,
        mensaje: 'Usuario CREADO',
        data: { id: result.insertId }
      });
    }
  );
};

// PUT actualizar
exports.update = (req, res) => {
  const { id } = req.params;
  const { nombre, email, edad } = req.body;
  
  if (!email || edad <= 0) {
    return res.status(400).json({
      transaccion: false,
      mensaje: 'Email obligatorio y edad mayor a 0',
      data: {}
    });
  }
  
  db.query(
    'UPDATE usuarios SET nombre=?, email=?, edad=? WHERE id=?',
    [nombre, email, edad, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          transaccion: false,
          mensaje: 'Error al actualizar',
          data: {}
        });
      }
      res.json({
        transaccion: true,
        mensaje: 'Usuario ACTUALIZADO',
        data: {}
      });
    }
  );
};



// DELETE eliminar
exports.delete = (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM usuarios WHERE id=?', [id], (err) => {
    if (err) {
      return res.status(500).json({
        transaccion: false,
        mensaje: 'Error al eliminar',
        data: {}
      });
    }
    res.json({
      transaccion: true,
      mensaje: 'Usuario ELIMINADO',
      data: {}
    });
  });
};