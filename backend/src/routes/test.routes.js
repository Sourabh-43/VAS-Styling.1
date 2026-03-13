const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});

router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: 'Welcome Admin'
  });
});

module.exports = router;
