const express = require('express');
const { createCustomer, getCustomer, getCustomers, customerStat, uploadCustomerPhoto, resizeCustomerPhoto, signUp } = require('../controllers/customerController');
const cartRouter = require('./cartRoutes');
const { getCustomerCarts } = require('../controllers/cartController');
const { getPayments } = require('../controllers/paymentController');
const router = express.Router();

router.use('/:customerId/customer_payments', getPayments)
router
    .route('/')
    .post(uploadCustomerPhoto, resizeCustomerPhoto, signUp)

router
    .route('/')
    .get(getCustomers)

router
    .route('/stats/:customerId')
    .get(customerStat)

router
    .route('/:customerId')
    .get(getCustomer)
const customerRouter = router;
module.exports = customerRouter;