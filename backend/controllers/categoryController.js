const Category = require("../models/categoryModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createCategory = catchAsyncError(async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: "Success",
    newCategory,
  });
});
exports.getCategories = catchAsyncError(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "Success",
    categories,
  });
});

exports.getCategory = catchAsyncError(async (req, res) => {
  const category = await Category.findById(req.params.id).populate("products");
  res.status(200).json({
    status: "Success",
    category,
  });
});
