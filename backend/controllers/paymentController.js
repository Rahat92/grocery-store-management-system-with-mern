const Customer = require("../models/customerModel");
const Payment = require("../models/paymentModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createPayment = catchAsyncError(async(req,res,next) => {
    const paid = await Payment.create(req.body)
    res.status(201).json({
        status: 'success',
        paid
    })
})
exports.getPayments = catchAsyncError(async(req,res,next) => {
    let queryObj = {};
    let docs;
    let totalPayments;
    let customerName;
    let payments = Payment.find();
    if (req.params.customerId) {
        const {name} = await Customer.findById(req.params.customerId)
        customerName = name
        queryObj.customer = req.params.customerId
        payments = await payments.find(queryObj)
        totalPayments = payments.map(el => el.paid).reduce((f,c) => f+c)
        docs = await Payment.find(queryObj).countDocuments()
        // totalPayments = 
    }else {
        docs = await Payment.find(queryObj).countDocuments()
        payments = await payments.find()
    }
    console.log(customerName);
    // const payments = await Payment.find(queryObj)
    res.status(201).json({
        status: 'success',
        docs,
        customerName,
        totalPayments,
        result: payments.length,
        payments,
    })
})