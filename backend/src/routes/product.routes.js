const router = require('express').Router();
const controller = require('../controllers/product.controller');

const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

/* GET ALL PRODUCTS */
router.get('/', controller.getProducts);

/* SEARCH PRODUCTS */
router.get('/search', controller.searchProducts);

/* GET PRODUCT BY ID */
router.get('/:id', controller.getProductById);

/* CREATE PRODUCT */
router.post(
  '/',
  auth,
  admin,
  controller.upload,
  controller.createProduct
);

/* UPDATE PRODUCT */
router.put(
  '/:id',
  auth,
  admin,
  controller.upload,
  controller.updateProduct
);

/* DELETE PRODUCT */
router.delete(
  '/:id',
  auth,
  admin,
  controller.deleteProduct
);

module.exports = router;