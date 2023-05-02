const Product = require("../models/productModel");
const ApiFeature = require("../uitls/apiFeatures");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createProduct = catchAsyncError(async(req,res,next) => {
    const product = await (await Product.create(
        [{
            name:"Pencil",
            quantity: 3,
            price: 5,
        },
        {
            name:"Pen",
            quantity: 5,
            price: 5,
        }]
    ))
    res.status(201).json({
        status:'success',
        product
    })
})

exports.getProducts = catchAsyncError(async(req,res,next) => {
    const query = Product.find()
    let products = new ApiFeature(query, req.query).filter();
    products = await products.query
    const totalProducts = await Product.countDocuments()
    res.status(201).json({
        status:'success',
        totalProducts,
        result: products.length,
        products
    })
})

exports.getProduct = catchAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.params.productId)
    res.status(201).json({
        status:'success',
        product
    })
})

exports.updateProduct = catchAsyncError(async(req,res,next) => {
    const desigrProduct = await Product.findById(req.params.productId)
    const product = await Product.findByIdAndUpdate(req.params.productId,{
        quantity:desigrProduct.quantity-1
    })
    res.status(201).json({
        status:'success',
        product
    })
})

exports.getProductStat = catchAsyncError(async(req,res,next) => {
    const stats = await Product.aggregate([
        // {
        //    $match:{totalAmount:{$gte: 0}}
        // },
        {
            $group: {
                _id: {$toUpper:'$name'},
                totalSellAmount: {$sum:'$totalAmount'},
                totalQuantity: {$sum: '$quantity'},
                numOfProduct: {$sum: 1},
            }
        },
        {
            $sort:{
                totalQuantity: -1
            }
        }
    ])
    res.status(200).json({
        status:'success',
        stats
    })
})

exports.getStats = catchAsyncError(async(req,res,next) => {
    const stats = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalSell: {$sum:'$totalAmount'},
                totalProduct: {$sum:'$quantity'},
                products: {$push: '$name'}
            }
        }
    ])
    res.status(200).json({
        status:'success',
        stats
    })
})

exports.monthLyStat = catchAsyncError(async(req,res,next) => {
    const year = req.params.year*1;
    console.log(year);
    const stats = await Product.aggregate([
        {
            $match: {
                soldAt:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group:{
                _id: {$month:'$soldAt'},
                totalSold: {$sum: '$totalAmount'},
                products: {$push: '$name'},
                NumOfProduct: {$push: '$quantity'}
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        stats
    })
})