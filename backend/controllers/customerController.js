const multer = require("multer");
const sharp = require("sharp");
const Customer = require("../models/customerModel");
const AppError = require("../uitls/AppError");
const catchAsyncError = require("../utils/catchAsyncError");
const { getCustomerCart } = require("./cartController");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only Image you can upload", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCustomerPhoto = upload.single("photo");
exports.resizeCustomerPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `customer-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/customer/${req.file.filename}`);
  next();
};
exports.createCustomer = catchAsyncError(async (req, res, next) => {
    if (req.file) {
        req.body.photo = req.file.filename
    }
  const customer = await Customer.create(req.body);
  res.status(201).json({
    status: "success",
    customer,
  });
});

exports.getCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findById(req.params.customerId)
    .populate("cart")
    .populate({ path: "paid", select: "paid paidAt -customer" });
  if (!customer) return next(new AppError("no customer found by this id", 400));
  let totalCart;
  if (customer?.cart.length > 0) {
    totalCart = customer?.cart
      ?.map((el) => el.totalAmount)
      .reduce((f, c) => f + c);
  } else {
    totalCart = 0;
  }
  let paidAmount = customer?.paid?.map((el) => el.paid);
  if (paidAmount?.length > 0) {
    paidAmount = paidAmount.reduce((f, c) => f + c);
  } else {
    paidAmount = 0;
  }
  const due = totalCart - paidAmount;

  res.status(201).json({
    status: "success",
    totalCartAmount: totalCart,
    paidAmount,
    due,
    customer,
  });
});

exports.getCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await Customer.find();
  const totalCustomers = await Customer.countDocuments();

  res.status(200).json({
    status: "success",
    totalCustomers,
    result: customers.length,
    customers,
  });
});

exports.customerStat = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findById(req.params.customerId);
  console.log(customer);
});
