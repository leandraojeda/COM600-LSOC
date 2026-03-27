// resolvers/ventasResolver.js
const db = require('../db');
// ─── QUERY: Listar todas las ventas ──────────────
const ventas = () => {
return new Promise((resolve, reject) => {
db.query('SELECT * FROM ventas', (err, results) => {
if (err) return reject(err);
resolve(results);
});
});
};
// ─── QUERY: Una venta con su detalle ────────────
const venta = ({ id }) => {
return new Promise((resolve, reject) => {
// Primero obtenemos la venta
db.query('SELECT * FROM ventas WHERE id = ?', [id], (err, ventaResult) => {
if (err) return reject(err);
if (ventaResult.length === 0) return reject(new Error('Venta no encontrada'));
const ventaData = ventaResult[0];
// Luego obtenemos el detalle de esa venta
db.query(
'SELECT * FROM detalle_venta WHERE venta_id = ?',
[id],
(err2, detalles) => {
if (err2) return reject(err2);
ventaData.detalle = detalles; // Anidamos el detalle en la venta
resolve(ventaData);
}
);
});
});
};

// ─── MUTATION: Crear venta completa con detalle ─
const crearVenta = ({ input }) => {
return new Promise((resolve, reject) => {
const { cliente, fecha, detalle } = input;
// Calcular el total sumando cantidad * precio de cada ítem
const total = detalle.reduce((sum, item) =>
sum + (item.cantidad * item.precio_unitario), 0
);
// 1) Insertar la cabecera de la venta
db.query(
'INSERT INTO ventas (cliente, fecha, total) VALUES (?, ?, ?)',
[cliente, fecha, total],
(err, result) => {
if (err) return reject(err);
const ventaId = result.insertId;
// 2) Preparar los ítems del detalle para inserción masiva
const valores = detalle.map(item =>
[ventaId, item.producto, item.cantidad, item.precio_unitario]
);
db.query(
'INSERT INTO detalle_venta (venta_id, producto, cantidad, precio_unitario) VALUES ?',
[valores],
(err2) => {
if (err2) return reject(err2);
// 3) Devolver la venta completa con su detalle
resolve({ id: ventaId, cliente, fecha, total, detalle });
}
);
}
);
});
};
// ─── MUTATION: Modificar un ítem del detalle ────
const modificarDetalleVenta = ({ id, input }) => {
return new Promise((resolve, reject) => {
const { producto, cantidad, precio_unitario } = input;
// Construir dinámicamente los campos a actualizar
const campos = [];
const valores = [];
if (producto !== undefined) { campos.push('producto = ?');
valores.push(producto); }
if (cantidad !== undefined) { campos.push('cantidad = ?');
valores.push(cantidad); }
if (precio_unitario !== undefined) { campos.push('precio_unitario = ?');
valores.push(precio_unitario); }
if (campos.length === 0) return reject(new Error('No se enviaron campos a actualizar'));
valores.push(id);
db.query(
`UPDATE detalle_venta SET ${campos.join(', ')} WHERE id = ?`,
valores,
(err) => {
if (err) return reject(err);
// Retornar el registro actualizado
db.query('SELECT * FROM detalle_venta WHERE id = ?', [id], (err2, rows) =>
{
if (err2) return reject(err2);
resolve(rows[0]);
});
}
);
});
};
// ─── MUTATION: Eliminar un ítem del detalle ─────
const eliminarDetalleVenta = ({ id }) => {
return new Promise((resolve, reject) => {
db.query('DELETE FROM detalle_venta WHERE id = ?', [id], (err, result) => {
    if (err) return reject(err);
if (result.affectedRows === 0)
return reject(new Error('Ítem no encontrado'));
resolve(`Ítem con id ${id} eliminado correctamente`);
});
});
};
// ─── Exportar todos los resolvers ─────────────
module.exports = { ventas, venta, crearVenta, modificarDetalleVenta,
eliminarDetalleVenta };