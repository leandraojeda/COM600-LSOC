require("reflect-metadata");
const express = require("express");
const path = require("path");
const AppDataSource = require("./data-source");
const UserEntity = require("./entity/User");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conectado a MySQL en XAMPP");
        const userRepository = AppDataSource.getRepository(UserEntity);

        app.get("/", async (req, res) => {
            const users = await userRepository.find();
            res.render("index", { users });
        });

        app.get("/users", async (req, res) => {
            const users = await userRepository.find();
            res.json(users);
        });

        app.post("/users", async (req, res) => {
            try {
                const nuevoUser = userRepository.create(req.body);
                await userRepository.save(nuevoUser);
                res.redirect("/"); // Regresa a la vista principal
            } catch (error) {
                res.status(500).send("Error al crear");
            }
        });

        app.post("/users/delete/:id", async (req, res) => {
            try {
                await userRepository.delete(req.params.id);
                res.redirect("/");
            } catch (error) {
                res.status(500).send("Error al eliminar");
            }
        });

        app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));
    })
    .catch(error => console.log(error));