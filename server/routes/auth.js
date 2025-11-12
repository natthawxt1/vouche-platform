const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes (ไม่ต้อง login)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (ต้อง login ก่อน)
router.get('/validate', authMiddleware, authController.validateToken);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;