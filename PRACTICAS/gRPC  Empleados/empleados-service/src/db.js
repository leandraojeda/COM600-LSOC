const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'rrhh_empleados',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexion exitosa a la base de datos');

  connection.query(`
    CREATE TABLE IF NOT EXISTS empleados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombres VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      cargo VARCHAR(100) NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err);
    } else {
      console.log('Tabla empleados lista');
    }
    connection.release();
  });
});

module.exports = pool;
