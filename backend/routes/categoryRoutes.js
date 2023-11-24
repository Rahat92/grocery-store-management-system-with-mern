const express = require('express');
const { createCategory, getCategories, getCategory } = require('../controllers/categoryController');
const router = express.Router();

router
    .route('/')
    .post(createCategory)
    .get(getCategories)

router
    .route('/:id')
    .get(getCategory)

const categoryRouter = router;
module.exports = categoryRouter;