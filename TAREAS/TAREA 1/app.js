const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Libro = require("./models/libro");
const app = express();
const path = require("path");
// Configuración
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Para soportar PUT y DELETE
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/usuarios", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});
// Rutas
app.get("/", async (req, res) => {
  const libros = await Libro.find();
  res.render("create", { libros });
});
app.get("/libros/create", (req, res) => {
  res.render("create");
});
app.post("/libros/create", async (req, res) => {
  const { titulo, autor, precio, categoria } = req.body;
  await Libro.create({ titulo, autor, precio, categoria });
  res.redirect("/");
});
app.get("/libros/:id", async (req, res) => {
  const libro = await Libro.findById(req.params.id);
  res.render("show", { libro });
});
app.get("/libros/:id/edit", async (req, res) => {
  const libro = await Libro.findById(req.params.id);
  res.render("edit", { libro });
});
app.put("/libros/:id", async (req, res) => {
  const { titulo, autor, precio, categoria } = req.body;
  await Libro.findByIdAndUpdate(req.params.id, {
    titulo,
    autor,
    precio,
    categoria,
  });
  res.redirect("/");
});
app.delete("/libros/:id", async (req, res) => {
  await Libro.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
