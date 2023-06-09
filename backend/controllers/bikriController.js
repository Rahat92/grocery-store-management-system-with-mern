const Bikri = require("../models/bikriModel");
const Product = require("../models/productModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createBikri = catchAsyncError(async(req,res,next) => {
    const newBikri = await Bikri.create(req.body)
    res.status(201).json({
        status:'success',
        newBikri
    })
})
exports.customerBikri = catchAsyncError(async(req,res,next) => {
    const customerBikri = await Bikri.find({customerId: req.params.customerId})
    console.log(customerBikri);
    res.status(201).json({
        status:'success',
        customerBikri
    })
})
exports.customerBikriStats = catchAsyncError(async(req,res,next) => {
    const year = req.params.year;
    const customerBikri = await Bikri.aggregate([
        {
            $match:{
                cartAt:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        // {
        //     $match: {
        //         cartAt:{
        //             $gte: new Date(`${year}-01-01`),
        //             $lte: new Date(`${year}-12-31`),
        //         }
        //     }
        // },
        {
            $match:{
                customerId: req.params.customerId
            }
        },
        {
            $project:{
                cartAt: 1,
                x:{$zip:{inputs: ["$productName", "$productId", "$productPrice", "$quantity","$totalAmount"]}}
            }
        },
        {
            $unwind: '$x'
        },
        {
            $project:{
                _id: false,
                // productName:{$last:"$x"},
                productName:{$arrayElemAt:["$x",0]},
                productId:{$arrayElemAt:["$x",1]},
                price:{$arrayElemAt:["$x",2]},
                // quantity:{$first:'$x'},
                quantity:{$arrayElemAt:["$x",3]},
                totalAmount:{$arrayElemAt:["$x",4]},
                cartAt:1,
            }
        },
        {
            $group:{
                _id: {$month:'$cartAt'},
                name:{$push:'$productName'},
                price:{$push:'$price'},
                quantityArr:{$push:'$quantity'},
                quantity: {$sum: '$quantity'},
                totalAmount: {$sum: '$totalAmount'},
                customer:{$push:req.params.customerId},
                cartAt: {$push: '$cartAt'}
            }
        },
        
    ])
    // const totalSoldPen = customerBikri.filter(el => el.dataArr[1] === 'Pen').map(el => el.dataArr[0]).reduce((f,c) => f+c, 0);
    console.log(customerBikri);
    
})