const express = require('express');
const { createCart, getCarts, getCart, getCustomerCarts, monthlyCartStat, customerMonthlyCartStat } = require('../controllers/cartController');
const router = express.Router({mergeParams: true})

router
    .route('/customercarts')
    .get(getCustomerCarts)
    
router
    .route('/')
    .get(getCarts)
router
    .route('/stat/:year')
    .get(monthlyCartStat)

router
    .route('/stat/:year/customer/:customerId')
    .get(customerMonthlyCartStat)

router
    .route('/:cartId')
    .get(getCart)

router
    .route('/:productId')
    .post(createCart)

const cartRouter = router;
module.exports = cartRouter;