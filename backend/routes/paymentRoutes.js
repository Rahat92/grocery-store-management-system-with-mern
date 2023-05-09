const express = require('express');
const { createProduct, getProducts, getProduct, getProductStat, getStats, monthLyStat, updateProduct } = require('../controllers/productController');
const { protect, restrictedTo } = require('../controllers/userController');
const { createPayment, getPayments } = require('../controllers/paymentController');
const router = express.Router({mergeParams:true})

router
    .route('/')
    .post(protect, restrictedTo('admin'), createPayment)

router
    .route('/payments')
    .get(protect, restrictedTo('admin'), getPayments )

const paymentRouter = router;
module.exports = paymentRouter;