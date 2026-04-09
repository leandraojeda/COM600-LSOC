const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'host.docker.internal',
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
  console.log('Conexión exitosa a la base de datos');

  connection.query(`
    CREATE TABLE IF NOT EXISTS empleados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      ci VARCHAR(20) NOT NULL UNIQUE,
      cargo VARCHAR(100) NOT NULL,
      departamento VARCHAR(100) NOT NULL,
      fecha_ingreso DATE NOT NULL,
      salario DECIMAL(10,2) NOT NULL,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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