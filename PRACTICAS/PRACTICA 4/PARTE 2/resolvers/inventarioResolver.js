const db = require('../db');


// ───────────QUERY'S────────────────

// QUERY: LISTAR TODOS LOS PRODUCTOS
const productos = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM productos', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// QUERY: LISTAR UN PRODUCTO
const producto = ({ id }) => {
  return new Promise((resolve, reject) => {

    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0)
        return reject(new Error('Producto no encontrado'));

      const productoData = result[0];

      db.query(
        'SELECT * FROM movimientos WHERE producto_id = ?',
        [id],
        (err2, movimientos) => {
          if (err2) return reject(err2);

          productoData.movimientos = movimientos;
          resolve(productoData);
        }
      );
    });

  });
};


// QUERY: MOVIMIENTOS SEGUN PRODUCTOS
const movimientos = ({ producto_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM movimientos WHERE producto_id = ?',
      [producto_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};



// QUERY: LISTAR TODOS LOS PROOVEDORES
const proveedores = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM proveedores', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// QUERY: LISTAR UN PROOVEDOR
const proveedor = ({ id }) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM proveedores WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error('Proveedor no encontrado'));

      resolve(results[0]);
    });
  });
};


// ───────────MUTATION────────────────

// MUTATION: CREAR PRODUCTO
const crearProducto = ({ input }) => {
  return new Promise((resolve, reject) => {

    const { nombre, categoria, precio } = input;

    db.query(
      'INSERT INTO productos (nombre, categoria, precio) VALUES (?, ?, ?)',
      [nombre, categoria, precio],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          id: result.insertId,
          nombre,
          categoria,
          precio,
          stock_actual: 0
        });
      }
    );

  });
};


// MUTATION: REGISTRAR MOVIENTO
const registrarMovimiento = ({ input }) => {
  return new Promise((resolve, reject) => {

    const { producto_id, tipo, cantidad, fecha, observacion } = input;

    db.query(
      'SELECT stock_actual FROM productos WHERE id = ?',
      [producto_id],
      (err, result) => {

        if (err) return reject(err);
        if (result.length === 0)
          return reject(new Error('Producto no existe'));

        let stock_actual = result[0].stock_actual;
        let nuevo_stock;

        // 2. Calcular nuevo stock
        if (tipo === 'ENTRADA') {
          nuevo_stock = stock_actual + cantidad;
        } else if (tipo === 'SALIDA') {
          nuevo_stock = stock_actual - cantidad;

        
          if (nuevo_stock < 0) {
            return reject(new Error('Stock insuficiente'));
          }
        } else {
          return reject(new Error('Tipo inválido'));
        }
        db.query(
          'INSERT INTO movimientos (producto_id, tipo, cantidad, fecha, observacion) VALUES (?, ?, ?, ?, ?)',
          [producto_id, tipo, cantidad, fecha, observacion],
          (err2, result2) => {

            if (err2) return reject(err2);
            db.query(
              'UPDATE productos SET stock_actual = ? WHERE id = ?',
              [nuevo_stock, producto_id],
              (err3) => {

                if (err3) return reject(err3);

                resolve({
                  id: result2.insertId,
                  producto_id,
                  tipo,
                  cantidad,
                  fecha,
                  observacion
                });

              }
            );

          }
        );

      }
    );

  });
};


// MUTATION: CREAR PROOVEDOR
const crearProveedor = ({ input }) => {
  return new Promise((resolve, reject) => {

    const { nombre, telefono, ciudad } = input;

    db.query(
      'INSERT INTO proveedores (nombre, telefono, ciudad) VALUES (?, ?, ?)',
      [nombre, telefono, ciudad],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          id: result.insertId,
          nombre,
          telefono,
          ciudad
        });
      }
    );

  });
};

// MUTATION: ACTUALIZAR EL PROOVEDOR
const actualizarProveedor = ({ id, input }) => {
  return new Promise((resolve, reject) => {

    const { nombre, telefono, ciudad } = input;

    const campos = [];
    const valores = [];

    if (nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(nombre);
    }

    if (telefono !== undefined) {
      campos.push('telefono = ?');
      valores.push(telefono);
    }

    if (ciudad !== undefined) {
      campos.push('ciudad = ?');
      valores.push(ciudad);
    }

    if (campos.length === 0)
      return reject(new Error('No hay campos para actualizar'));

    valores.push(id);

    db.query(
      `UPDATE proveedores SET ${campos.join(', ')} WHERE id = ?`,
      valores,
      (err) => {

        if (err) return reject(err);

        db.query('SELECT * FROM proveedores WHERE id = ?', [id], (err2, rows) => {
          if (err2) return reject(err2);
          resolve(rows[0]);
        });

      }
    );

  });
};


// MUTATION: ELIMINAR AL PROOVEDOR
const eliminarProveedor = ({ id }) => {
  return new Promise((resolve, reject) => {

    db.query('DELETE FROM proveedores WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0)
        return reject(new Error('Proveedor no encontrado'));

      resolve(`Proveedor Eliminado`);
    });

  });
};

module.exports = {
  productos,
  producto,
  movimientos,
  proveedores,
  proveedor,
  crearProducto,
  registrarMovimiento,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};