const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Libro = require("./models/libro");
const path = require("path");

const app = express();

// 1. Configuración y Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// Importante: Tus formularios actuales no usan _method, así que usaremos rutas POST/GET directas 
// para que no tengas que cambiar todos tus archivos .ejs
app.use(methodOverride("_method")); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/biblioteca")
    .then(() => console.log("Conectado a la base de datos 'biblioteca'"))
    .catch(err => console.error("Error de conexión:", err));

// --- 4. Rutas (Express) ---

// LISTAR: GET /
app.get("/", async (req, res) => {
    try {
        const libros = await Libro.find();
        res.render("create", { libros });
    } catch (err) {
        res.status(500).send("Error al obtener los libros");
    }
});

// FORMULARIO CREAR: GET /create (Cambiado de /nuevo a /create para coincidir con listar.ejs)
app.get("/create", (req, res) => {
    res.render("create");
});
// 2. Creamos una nueva ruta "/lista" para ver los libros
app.get("/listar", async (req, res) => {
    try {
        const libros = await Libro.find();
        res.render("listar", { libros });
    } catch (err) {
        res.status(500).send("Error");
    }
});

// GUARDAR: POST /libros/create (Coincide con el action de tu create.ejs)
app.post("/libros/create", async (req, res) => {
    try {
        await Libro.create(req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error al guardar el libro");
    }
});

// FORMULARIO EDITAR: GET /edit/:id (Coincide con listar.ejs y edit.ejs)
app.get("/edit/:id", async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        res.render("edit", { libro });
    } catch (err) {
        res.status(404).send("Libro no encontrado");
    }
});

// ACTUALIZAR: POST /edit/:id (Tu edit.ejs usa POST, no PUT)
app.post("/edit/:id", async (req, res) => {
    try {
        await Libro.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error al actualizar");
    }
});

// ELIMINAR: GET /delete/:id (Tu listar.ejs usa un enlace <a> que es GET, no DELETE)
app.get("/delete/:id", async (req, res) => {
    try {
        await Libro.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error al eliminar");
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});