const express = require('express');
const { createProduct, getProducts, getProduct, getProductStat, getStats, monthLyStat, updateProduct } = require('../controllers/productController');
const { protect, restrictedTo } = require('../controllers/userController');
const { createPayment } = require('../controllers/paymentController');
const router = express.Router()

router
    .route('/')
    .post(protect, restrictedTo('admin'), createPayment)

const paymentRouter = router;
module.exports = paymentRouter;