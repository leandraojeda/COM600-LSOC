const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  db.query('SELECT * FROM contactos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('index', { contactos: results });
  });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'INSERT INTO contactos (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo],
    (err) => {
      if (err) return res.status(500).send(err);
      res.redirect('/');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM contactos WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('edit', { contacto: results[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'UPDATE contactos SET nombres=?, apellidos=?, fecha_nacimiento=?, direccion=?, celular=?, correo=? WHERE id=?',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.redirect('/');
    }
  );
});

app.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM contactos WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});
