const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

// VISTAS - Rutas ESPECÍFICAS primero
router.get('/', libroController.showAll);
router.get('/create', libroController.showCreate);
router.post('/', libroController.createView);

// Rutas DINÁMICAS después
router.get('/:id', libroController.show);
router.get('/:id/edit', libroController.showEdit);
router.put('/:id', libroController.updateView);
router.delete('/:id', libroController.deleteView);

module.exports = router;