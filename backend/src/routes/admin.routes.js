const router = require('express').Router();
const controller = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

/* =======================
   ADMIN PRODUCT ROUTES
======================= */

/* CREATE PRODUCT */
router.post(
  '/products',
  auth,
  admin,
  controller.upload,
  controller.createProduct
);

/* UPDATE PRODUCT */
router.put(
  '/products/:id',
  auth,
  admin,
  controller.upload,
  controller.updateProduct
);

/* DELETE PRODUCT */
router.delete(
  '/products/:id',
  auth,
  admin,
  controller.deleteProduct
);

module.exports = router;