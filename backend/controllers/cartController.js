const Product = require("../models/productModel");
const AppError = require("../uitls/AppError");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createCart = catchAsyncError(async(req,res,next) => {
    const desigrProduct = await Product.findById(req.params.productId)
    const {quantity, customer} = req.body;
    req.body.customerId = customer
    const totalAmount = desigrProduct.price*quantity;
    const productName = desigrProduct.name;
    if(!req.body.totalAmount) req.body.totalAmount = totalAmount
    if(!req.body.product) req.body.product = req.params.productId
    req.body.productName = productName;
    req.body.productPrice = desigrProduct.price;
    let cart;
    if(desigrProduct.quantity>0 && desigrProduct.quantity>=quantity){
        cart = await Cart.create(req.body)
        // await Product.findByIdAndUpdate(req.params.productId,{
        //     quantity:desigrProduct.quantity-quantity,
        // },{new:true})
        console.log(req.params.productId);
        const my = await cart.cartsCalculate(req.params.productId)
        console.log(my);
    }else{
        return next(new AppError('No Product available', 400))
    }
    res.status(201).json({
        status: 'success',
        cart
    })
})

exports.getCart = catchAsyncError(async(req,res,next) => {
    const cart = await Cart.findById(req.params.cartId).populate('customer')
    res.status(200).json({
        status: 'success',
        cart
    })
})

exports.getCustomerCarts = catchAsyncError(async(req,res,next) => {
    const carts = await Cart.find({customer:req.params.customerId})
    let cartsAmount;
    if(carts.length>0){
        cartsAmount = carts.map(el => el.totalAmount).reduce((f,c) => f+c)
    }else{
        cartsAmount = 0
    }
    console.log(carts);
    res.status(200).json({
        status: 'successsss',
        result: carts.length,
        cartsAmount,
        carts
    })
})

exports.getCarts = catchAsyncError(async(req,res,next) => {
    const carts = await Cart.find()
    const totalCarts = await Cart.countDocuments()
    res.status(200).json({
        status: 'success',
        result: carts.length,
        totalCarts,
        carts
    })
})

exports.monthlyCartStat = catchAsyncError(async(req,res,next) => {
    const year = req.params.year*1;
    const stats = await Cart.aggregate([
        {
            $match: {
                cartAt:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group:{
                _id: {$month:'$cartAt'},
                totalSold: {$sum: '$totalAmount'},
                productName:{$push:'$productName'},
                
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        stats
    })
})

exports.customerMonthlyCartStat = catchAsyncError(async(req,res,next) => {
    const year = req.params.year*1;
    console.log(req.params.customerId);
    const stats = await Cart.aggregate([
        {
            $match: {
                cartAt:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $match: {
                customerId:req.params.customerId
            }
        },
        {
            $group:{
                _id: {$month:'$cartAt'},
                totalSold: {$sum: '$totalAmount'},
                productName:{$push:'$productName'},
                totalAmount: {$push:'$totalAmount'},
                productPrice: {$push:'$productPrice'},
                quantity: {$push:'$quantity'},
                cartAt:{$push:'$cartAt'}

            }
        }
    ])
    res.status(200).json({
        status: 'success',
        stats
    })
})
