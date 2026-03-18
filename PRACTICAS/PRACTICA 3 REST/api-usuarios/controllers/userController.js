const db = require('../db');
// GET todos
exports.getAll = (req, res) => {
db.query('SELECT * FROM usuarios', (err, results) => {
if (err) return res.status(500).json(err);
res.json(results);
});
};
// GET por ID
exports.getById = (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
if (err) return res.status(500).json(err);
if (results.length === 0) return res.status(404).json({ mensaje: 'No encontrado'
});
res.json(results[0]);
});
};
// POST crear
exports.create = (req, res) => {
const { nombre, email, edad } = req.body;
db.query(
'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)',
[nombre, email, edad],
(err, result) => {
if (err) return res.status(500).json(err);
res.status(201).json({ id: result.insertId });

}
);
};
// PUT actualizar
exports.update = (req, res) => {
const { id } = req.params;
const { nombre, email, edad } = req.body;
db.query(
'UPDATE usuarios SET nombre=?, email=?, edad=? WHERE id=?',
[nombre, email, edad, id],
(err, result) => {
if (err) return res.status(500).json(err);
res.json({ mensaje: 'Actualizado correctamente' });
}
);
};
// DELETE eliminar
exports.delete = (req, res) => {
const { id } = req.params;
db.query('DELETE FROM usuarios WHERE id=?', [id], (err) => {
if (err) return res.status(500).json(err);
res.json({ mensaje: 'Eliminado correctamente' });
});
};