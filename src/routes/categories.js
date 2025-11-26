const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas protegidas solo para ADMIN
router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory);

module.exports = router;
