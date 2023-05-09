const Bikri = require("../models/bikriModel");
const Product = require("../models/productModel");
const ApiFeature = require("../uitls/apiFeatures");
const catchAsyncError = require("../utils/catchAsyncError");
exports.createBikri = catchAsyncError(async(req,res,next) => {
    const newBikri = await Bikri.create(req.body)
    res.status(201).json({
        status:'success',
        newBikri
    })
})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
exports.customerBikri = catchAsyncError(async(req,res,next) => {
    let customerBikri = Bikri.find({customerId: req.params.customerId})
    const documents = await Bikri.find({customerId: req.params.customerId}).countDocuments();
    const atAllAmount = (await Bikri.find({customerId: req.params.customerId})).map(el => el.totalBikri).reduce((f,c) => f+c);
    console.log(atAllAmount)
    const features = new ApiFeature(customerBikri, req.query).filter().sort().pagination()
    customerBikri = await features.query;
    res.status(201).json({
        status: 'success',
        documents: documents,
        result: customerBikri.length,
        pages: Math.ceil(documents/3),
        totalCart: atAllAmount,
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
    // const totalSoldPen = customerBikri.filter(el => el=== 'Pen').map(el => el.dataArr[0]).reduce((f,c) => f+c, 0);  
    console.log(customerBikri);
})