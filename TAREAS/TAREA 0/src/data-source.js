const { DataSource } = require("typeorm");
const UserEntity = require("./entity/User");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "", // XAMPP por defecto no tiene contraseña
    database: "bd_usuarios", // CAMBIA ESTO por el nombre de tu BD en phpMyAdmin
    synchronize: true, // Esto crea las tablas automáticamente
    logging: false,
    entities: [UserEntity],
});

module.exports = AppDataSource;