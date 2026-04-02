const router = require('express').Router();
const controller = require('../controllers/product.controller');

/* GET ALL PRODUCTS */
router.get('/', controller.getProducts);

/* SEARCH PRODUCTS */
router.get('/search', controller.searchProducts);

/* GET PRODUCT BY ID */
router.get('/:id', controller.getProductById);

module.exports = router;