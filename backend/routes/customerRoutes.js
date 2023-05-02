const express = require('express');
const { createCustomer, getCustomer, getCustomers, customerStat } = require('../controllers/customerController');
const cartRouter = require('./cartRoutes');
const { getCustomerCarts } = require('../controllers/cartController');
const router = express.Router();

router.use('/:customerId/cart/customercarts', getCustomerCarts)
router
    .route('/')
    .post(createCustomer)

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