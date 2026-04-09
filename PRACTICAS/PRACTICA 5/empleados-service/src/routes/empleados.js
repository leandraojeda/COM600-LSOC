const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
// Endpoints Requeridos
// 1. GET /empleados
router.get('/', (req, res) => {
  const { departamento } = req.query;
  let query = 'SELECT * FROM empleados WHERE activo = true';
  const params = [];

  if (departamento) {
    query += ' AND departamento = ?';
    params.push(departamento);
  }

  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. GET /empleados/:id
router.get('/:id', (req, res) => {
  db.query(
    'SELECT * FROM empleados WHERE id = ? AND activo = true',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: 'EMPLEADO NO ENCONTRADO' });
      res.json(rows[0]);
    }
  );
});

// 3.POST /empleados
router.post('/', (req, res) => {
  const { nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario } = req.body;

  if (!nombre || !apellido || !ci || !cargo || !departamento || !fecha_ingreso || !salario)
    return res.status(400).json({ error: 'LLENAR TODOS LOS CAMPOS' });

  if (salario <= 0)
    return res.status(400).json({ error: 'EL SALARIO NO PUEDE SER 0' });

  if (new Date(fecha_ingreso) > new Date())
    return res.status(400).json({ error: 'LA FECHA NO PUEDE SER FUTURA' });

  db.query('SELECT id FROM empleados WHERE ci = ?', [ci], (err, existe) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existe.length > 0) return res.status(400).json({ error: 'CI DUPLICADO' });

    db.query(
      `INSERT INTO empleados (nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('SELECT * FROM empleados WHERE id = ?', [result.insertId], (err, nuevo) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(nuevo[0]);
        });
      }
    );
  });
});

// 4.PUT /empleados/:id
router.put('/:id', (req, res) => {
  const { nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario } = req.body;

  if (salario !== undefined && salario <= 0)
    return res.status(400).json({ error: 'EL SALARIO DEBE SER MAYOR A 0' });

  db.query(
    `UPDATE empleados SET nombre=?, apellido=?, ci=?, cargo=?, departamento=?, fecha_ingreso=?, salario=?
     WHERE id=?`,
    [nombre, apellido, ci, cargo, departamento, fecha_ingreso, salario, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query('SELECT * FROM empleados WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: 'NO EXISTE EMPLEADO' });
        res.json(rows[0]);
      });
    }
  );
});

//5.  DELETE /empleados/:id (baja logica)
router.delete('/:id', (req, res) => {
  db.query('SELECT * FROM empleados WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'NO EXISTE EMPLEADO' });

    db.query('UPDATE empleados SET activo = false WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query('SELECT * FROM empleados WHERE id = ?', [req.params.id], (err, updated) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updated[0]);
      });
    });
  });
});

//6. GET /empleados/:id/proyectos
router.get('/:id/proyectos', (req, res) => {
  db.query(
    'SELECT * FROM empleados WHERE id = ? AND activo = true',
    [req.params.id],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: 'NO EXISTE EMPLEADO' });

      const query = `
        query {
          proyectosPorEmpleado(empleadoId: "${req.params.id}") {
            id nombre estado fechaInicio presupuesto
          }
        }
      `;

      try {
        const response = await axios.post('http://proyectos-service:3002/graphql', { query });
        const proyectos = response.data.data.proyectosPorEmpleado;
        res.json({ empleado: rows[0], proyectos });
      } catch (e) {
        res.status(500).json({ error: 'ERROR' });
      }
    }
  );
});

module.exports = router;