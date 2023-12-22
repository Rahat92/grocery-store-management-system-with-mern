const Bikri = require("../models/bikriModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const AppError = require("../uitls/AppError");
const ApiFeature = require("../uitls/apiFeatures");
const catchAsyncError = require("../utils/catchAsyncError");
exports.createBikri = catchAsyncError(async (req, res, next) => {
  const products = await Promise.all(
    req.body.productName.map(async (el) => {
      return await Product.findOne({ name: el });
    })
  );
  console.log(products);
  const storeMessage = products
    .map((el) => {
      if (el.quantity === 0) {
        return el.name;
      }
    })
    .filter((el) => el !== undefined);
  console.log(storeMessage);
  if (storeMessage.length > 0) {
    const msg = storeMessage.join(",");
    return next(new AppError(`No ${msg} Found in store`, 400));
  }
  const quantity = products
    .map((el, i) => {
      if (el.quantity < req.body.quantity[i]) {
        return el.name;
      }
    })
    .filter((el) => el !== undefined);
  if (quantity.length > 0) {
    return next(new AppError(`Too Much product ${quantity.join(",")}`, 400));
  }
  const newBikri = await Bikri.create(req.body);
  res.status(201).json({
    status: "Success",
    newBikri,
  });
});
exports.updateBikri = catchAsyncError(async (req, res, next) => {
  let updatedBikri = await Bikri.findByIdAndUpdate(
    req.params.bikriId,
    {
      payAmount: req.body.payAmount,
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    updatedBikri,
  });
});
exports.sellerBikriStatsYearly = catchAsyncError(async (req, res) => {
  const year = 2023;
  const customerBikri = await Bikri.aggregate([
    {
      $match: {
        cartAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $match: {
        customerId: {
          $ne: undefined,
        },
      },
    },
    {
      $project: {
        cartAt: 1,
        customerId: 1,
        x: {
          $zip: {
            inputs: [
              "$productName",
              "$productId",
              "$productPrice",
              "$quantity",
              "$totalAmount",
              "$totalBuyAmount",
              "$productBuyPrice",
            ],
          },
        },
      },
    },
    {
      $unwind: "$x",
    },
    {
      $project: {
        _id: false,
        // productName:{$last:"$x"},
        productName: { $arrayElemAt: ["$x", 0] },
        productId: { $arrayElemAt: ["$x", 1] },
        price: { $arrayElemAt: ["$x", 2] },
        // quantity:{$first:'$x'},
        quantity: { $arrayElemAt: ["$x", 3] },
        totalAmount: { $arrayElemAt: ["$x", 4] },
        totalBuyAmount: { $arrayElemAt: ["$x", 5] },
        productBuyPrice: { $arrayElemAt: ["$x", 6] },
        cartAt: 1,
        customerId: 1,
        password: 1,
      },
    },
    {
      $group: {
        _id: "$customerId",
        totalAmount: { $push: "$totalAmount" },
        month: { $push: { $month: "$cartAt" } },
      },
    },
  ]);
  const customers = await Promise.all(
    customerBikri.map(async (el) => {
      return await Customer.findById(el._id).select(
        "name phoneNo -_id password"
      );
    })
  );
  console.log(customerBikri);
  res.status(200).json({
    status: "Success",
    customers,
    customerBikri,
  });
});
exports.customerBikri = catchAsyncError(async (req, res, next) => {
  let customerBikri = Bikri.find({ customerId: req.params.customerId });
  const limit = req.query.limit ? Number(req.query.limit) : 3;
  console.log("limit", limit);
  const documents = await Bikri.find({
    customerId: req.params.customerId,
  }).countDocuments();
  //   if (documents === 0) {
  //     return next(new AppError("no Customer found by this id", 400));
  //   }
  const buyArr = await Bikri.find({ customerId: req.params.customerId });
  const atAllAmount = buyArr
    .map((el) => {
      return el.totalBikri;
    })
    .reduce((f, c) => f + c, 0);
  const allSubmitMoney = buyArr
    .map((el) => el.payAmount)
    .reduce((f, c) => f + c, 0);
  console.log("allsubmit", allSubmitMoney);
  const allDue = buyArr.map((el) => el.dueAmount).reduce((f, c) => f + c, 0);
  console.log("allDue", allDue);
  const allKroyMullo = buyArr
    .map((el) => {
      return el.kroyMullo;
    })
    .reduce((f, c) => f + c, 0);
  customerBikri = new ApiFeature(customerBikri, req.query)
    .filter()
    .sort()
    .pagination(limit);
  customerBikri = await customerBikri.query;
  res.status(201).json({
    status: "success",
    documents,
    result: customerBikri.length,
    pages: Math.ceil(documents / limit),
    currentPage: req.query.page * 1 || 1,
    totalCart: atAllAmount,
    totalDue: allDue,
    totalBuyAmount: allKroyMullo,
    allSubmitMoney,
    customerBikri,
  });
});

exports.customerBikriStatsMonthly = catchAsyncError(async (req, res, next) => {
  const year = req.params.year;
  console.log("good");
  const customerBikri = await Bikri.aggregate([
    {
      $match: {
        cartAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $match: {
        customerId: req.params.customerId,
      },
    },

    {
      $project: {
        cartAt: 1,
        x: {
          $zip: {
            inputs: [
              "$productName",
              "$productId",
              "$productPrice",
              "$quantity",
              "$totalAmount",
            ],
          },
        },
      },
    },
    {
      $unwind: "$x",
    },
    {
      $project: {
        _id: false,
        // productName:{$last:"$x"},
        productName: { $arrayElemAt: ["$x", 0] },
        productId: { $arrayElemAt: ["$x", 1] },
        price: { $arrayElemAt: ["$x", 2] },
        // quantity:{$first:'$x'},
        quantity: { $arrayElemAt: ["$x", 3] },
        totalAmount: { $arrayElemAt: ["$x", 4] },
        cartAt: 1,
      },
    },
    // {
    //   $match: {
    //     productName: req.params.productName,
    //   },
    // },
    {
      $group: {
        _id: { $month: "$cartAt" },
        name: { $push: "$productName" },
        price: { $push: "$price" },
        quantityArr: { $push: "$quantity" },
        quantity: { $sum: "$quantity" },
        totalAmount: { $sum: "$totalAmount" },
        cartAt: { $push: "$cartAt" },
      },
    },
  ]);
  // const totalSoldPen = customerBikri.filter(el => el=== 'Pen').map(el => el.dataArr[0]).reduce((f,c) => f+c, 0);
  res.status(200).json({
    customerBikri,
  });
});

exports.sellerBikriStatsMonthly = catchAsyncError(async (req, res, next) => {
  const year = req.params.year;
  const customerBikri = await Bikri.aggregate([
    {
      $match: {
        cartAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    // {
    //   $match: {
    //     productName: req.params.productName,
    //   },
    // },

    {
      $project: {
        cartAt: 1,
        x: {
          $zip: {
            inputs: [
              "$productName",
              "$productId",
              "$productPrice",
              "$quantity",
              "$totalAmount",
              "$totalBuyAmount",
              "$productBuyPrice",
            ],
          },
        },
      },
    },
    {
      $unwind: "$x",
    },
    {
      $project: {
        _id: false,
        // productName:{$last:"$x"},
        productName: { $arrayElemAt: ["$x", 0] },
        productId: { $arrayElemAt: ["$x", 1] },
        price: { $arrayElemAt: ["$x", 2] },
        // quantity:{$first:'$x'},
        quantity: { $arrayElemAt: ["$x", 3] },
        totalAmount: { $arrayElemAt: ["$x", 4] },
        totalBuyAmount: { $arrayElemAt: ["$x", 5] },
        productBuyPrice: { $arrayElemAt: ["$x", 6] },
        cartAt: 1,
      },
    },

    {
      $group: {
        _id: { $month: "$cartAt" },
        name: { $push: "$productName" },
        price: { $push: "$price" },
        buyPrice: { $push: "$productBuyPrice" },
        quantityArr: { $push: "$quantity" },
        quantity: { $sum: "$quantity" },
        totalAmount: { $sum: "$totalAmount" },
        totalBuyAmount: { $sum: "$totalBuyAmount" },
        customer: { $push: req.params.customerId },
        cartAt: { $push: "$cartAt" },
      },
    },
  ]);
  // const totalSoldPen = customerBikri.filter(el => el=== 'Pen').map(el => el.dataArr[0]).reduce((f,c) => f+c, 0);
  console.log(customerBikri);
  res.status(200).json({
    customerBikri,
  });
});
