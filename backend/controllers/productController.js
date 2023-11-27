const Product = require("../models/productModel");
const ApiFeature = require("../uitls/apiFeatures");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const product = await (
    await Product.create(req.body)
  ).populate({ path: "category" });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getProducts = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  //   const limit = req.query.limit ? Number(req.query.limit) : 3;
  const limit = req.query.limit;
  const query = Product.find();
  let products = new ApiFeature(query, req.query)
    .filter()
    .pagination(limit)
    .search();
  products = await products.query;
  const queryObj = {};
  if (req.query.productCategory) {
    queryObj.productCategory = req.query.productCategory;
  } else {
    delete Object(queryObj)[req.query.productCategory];
  }
  const totalProducts = await Product.find({
    ...queryObj,
    name: { $regex: req.query.keyword, $options: "i" },
  }).countDocuments();
  let searchProductLength = 0;
  if (req.query.keyword) {
    searchProductLength = products.length;
  }
  console.log("38", searchProductLength);
  console.log(totalProducts);
  res.status(201).json({
    status: "success",
    totalProducts,
    result: products.length,
    currentPage: req.query.page * 1 || 1,
    pages: Math.ceil(totalProducts / limit),
    products,
  });
});

exports.getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const desigrProduct = await Product.findById(req.params.productId);
  const product = await Product.findByIdAndUpdate(req.params.productId, {
    quantity: desigrProduct.quantity - 1,
  });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getProductStat = catchAsyncError(async (req, res, next) => {
  const stats = await Product.aggregate([
    // {
    //    $match:{totalAmount:{$gte: 0}}
    // },
    {
      $group: {
        _id: { $toUpper: "$name" },
        totalSellAmount: { $sum: "$totalAmount" },
        totalQuantity: { $sum: "$quantity" },
        numOfProduct: { $sum: 1 },
      },
    },
    {
      $sort: {
        totalQuantity: -1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    stats,
  });
});

exports.getStats = catchAsyncError(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalSell: { $sum: "$totalAmount" },
        totalProduct: { $sum: "$quantity" },
        products: { $push: "$name" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    stats,
  });
});

exports.monthLyStat = catchAsyncError(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);
  const stats = await Product.aggregate([
    {
      $match: {
        soldAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$soldAt" },
        totalSold: { $sum: "$totalAmount" },
        products: { $push: "$name" },
        NumOfProduct: { $push: "$quantity" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    stats,
  });
});
