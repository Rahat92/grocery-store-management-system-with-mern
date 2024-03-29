const express = require('express');
const { createProduct, getProducts, getProduct, getProductStat, getStats, monthLyStat, updateProduct, uploadProductPhoto, resizeProductPhoto } = require('../controllers/productController');
const { protect, restrictedTo } = require('../controllers/userController');
const router = express.Router()

router
    .route('/')
    .post(uploadProductPhoto,resizeProductPhoto,createProduct)
    .get(getProducts)

router
    .route('/stats')
    .get(protect, restrictedTo('admin'), getProductStat)

router
    .route('/stats/:year')
    .get(protect, restrictedTo('admin'), monthLyStat)

router
    .route('/:productId')
    .get(protect, restrictedTo('admin'), getProduct)
    .patch(protect, restrictedTo('admin'), updateProduct)
    
router
    .route('/overall-stats')
    .get(protect, restrictedTo('admin'), getStats)
    
    
router
    .route('/:year')
    .get(protect, restrictedTo('admin'), monthLyStat)





const productRouter = router;
module.exports = productRouter