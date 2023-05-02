const express = require('express');
const { createBikri, customerBikri, customerBikriStats } = require('../controllers/bikriController');
const router = express.Router()

router
    .route('/')
    .post(createBikri)
router
    .route('/customer/:customerId/stats/:year')
    .get(customerBikriStats)
router
    .route('/customer/:customerId')
    .get(customerBikri)
const bikriRouter = router;
module.exports = bikriRouter