const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// 🔥 IMPORTANT: pass FUNCTIONS, not objects
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
