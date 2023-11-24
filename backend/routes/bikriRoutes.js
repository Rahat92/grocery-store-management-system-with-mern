const express = require('express');
const {
  createBikri,
  customerBikri,
  customerBikriStatsMonthly,
  updateBikri,
  sellerBikriStatsMonthly,
  sellerBikriStatsYearly,
} = require("../controllers/bikriController");
const router = express.Router()

router
    .route('/')
    .post(createBikri)

router
    .route('/:bikriId')
    .patch(updateBikri)
    
router
  .route("/stats/:year")
  .get(sellerBikriStatsMonthly);
router
  .route("/customers-sell/:year")
  .get(sellerBikriStatsYearly)
router
  .route("/customer/:customerId/stats/:year")
  .get(customerBikriStatsMonthly);

  
  router
  .route('/customer/:customerId')
  .get(customerBikri)
  
const bikriRouter = router;
module.exports = bikriRouter