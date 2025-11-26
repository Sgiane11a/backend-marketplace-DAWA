const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Rutas públicas (accesibles por CUSTOMER y ADMIN)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas solo para ADMIN
router.post('/', authenticateToken, authorizeRoles('ADMIN'), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;