const Payment = require("../models/paymentModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createPayment = catchAsyncError(async(req,res,next) => {
    const paid = await Payment.create(req.body)
    res.status(201).json({
        status: 'success',
        paid
    })
})