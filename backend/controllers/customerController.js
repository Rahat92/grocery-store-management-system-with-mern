const Customer = require("../models/customerModel");
const AppError = require("../uitls/AppError");
const catchAsyncError = require("../utils/catchAsyncError");
const { getCustomerCart } = require("./cartController");

exports.createCustomer = catchAsyncError(async(req,res,next) => {
    const customer = await Customer.create(req.body)
    res.status(201).json({
        status:'success',
        customer
    })
})

exports.getCustomer = catchAsyncError(async(req,res,next) => {
    const customer = await Customer.findById(req.params.customerId).populate('cart').populate({path:'paid',select:'paid paidAt -customer'})
    if(!customer) return next(new AppError('no customer found by this id', 400))
    let totalCart;
    if(customer?.cart.length>0){
        totalCart = customer?.cart?.map(el => el.totalAmount).reduce((f,c) => f+c)
    }else{
        totalCart = 0
    }
    // let totalBuy = customer.product.map(el => el.totalAmount);
    
    // if(totalBuy.length>0){
    //     totalBuy = totalBuy.reduce((f,c) => f+c)
    // }else{
    //     totalBuy = 0
    // }
    let paidAmount = customer?.paid?.map(el => el.paid)
    if(paidAmount?.length>0){
        paidAmount = paidAmount.reduce((f,c) => f+c)
    }else{
        paidAmount = 0
    }
    const due = totalCart-paidAmount
    // const customArr = customer.product.map(product => {
    //     return {
    //         productName:
    //     }
    // })

    res.status(201).json({
        status:'success',
        totalCartAmount: totalCart,
        paidAmount,
        due,
        customer,
    })
})

exports.getCustomers = catchAsyncError(async(req,res,next) => {
    const customers = await Customer.find()
    const totalCustomers = await Customer.countDocuments()
    
    res.status(200).json({
        status:'success',
        totalCustomers,
        result: customers.length,
        customers
    })
})

exports.customerStat = catchAsyncError(async(req,res,next) => {
    const customer = await Customer.findById(req.params.customerId)
    console.log(customer);
})

