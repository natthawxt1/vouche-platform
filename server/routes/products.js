const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticateToken, isAdmin, productController.addProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;