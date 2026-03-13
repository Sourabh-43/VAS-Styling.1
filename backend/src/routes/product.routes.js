const router = require('express').Router();
const controller = require('../controllers/product.controller');

/* =======================
   PUBLIC PRODUCT ROUTES
======================= */

router.get('/', controller.getProducts);

/* FIRST → GET BY ID */
router.get('/id/:id', controller.getProductById);



module.exports = router;