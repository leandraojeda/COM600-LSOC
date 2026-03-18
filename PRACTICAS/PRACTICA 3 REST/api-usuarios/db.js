const mysql = require('mysql2');
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'api_rest'
});
connection.connect((err) => {

if (err) {
console.error('Error de conexión:', err);
} else {
console.log('Conectado a MySQL');
}
});
module.exports = connection;

