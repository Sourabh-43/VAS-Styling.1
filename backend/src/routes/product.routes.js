const router = require('express').Router();
const controller = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');

/* GET ALL PRODUCTS */
router.get('/', controller.getProducts);

/* SEARCH PRODUCTS */
router.get('/search', controller.searchProducts);

/* GET PRODUCT BY ID */
router.get('/:id', controller.getProductById);

/* CREATE PRODUCT */
router.post(
  '/',
  protect,
  admin,
  controller.upload,
  controller.createProduct
);

/* UPDATE PRODUCT */
router.put(
  '/:id',
  protect,
  admin,
  controller.upload,
  controller.updateProduct
);

/* DELETE PRODUCT */
router.delete(
  '/:id',
  protect,
  admin,
  controller.deleteProduct
);

module.exports = router;