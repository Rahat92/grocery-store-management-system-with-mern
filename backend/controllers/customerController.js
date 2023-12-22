const multer = require("multer");
const sharp = require("sharp");
const Customer = require("../models/customerModel");
const AppError = require("../uitls/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
const tokenProducer = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TOKEN,
  });
};
const resAndSendToken = (user, res, statusCode) => {
  const token = tokenProducer(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, cookieOptions);
  if (process.env.NODE_ENV === "PRODUCTION") cookieOptions.secure = true;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.protect = catchAsyncError(async (req, res, next) => {
  console.log("hello world");
  const { token } = req.cookies;
  if (!token)
    return next(
      new AppError(`You are now not logged in, Please log in first`, 400)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  console.log(decoded);
  const currentUser = await Customer.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(`The user belonging this token is no longer exist`, 400)
    );
  if (currentUser.isPasswordChanged(decoded.iat))
    return next(
      new AppError(
        `The user changed password after issuing this  token, Please log in again`,
        400
      )
    );
  req.user = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(`You are not allowed to perform this action`, 400)
      );
    next();
  };
};

exports.createCustomer = catchAsyncError(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  const customer = await Customer.create(req.body);
  res.status(201).json({
    status: "success",
    customer,
  });
});

exports.signUp = catchAsyncError(async (req, res, next) => {
  console.log(req.body)
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  const { name, email, password, passwordConfirm, photo, phoneNo } = req.body;
  const user = await Customer.create({
    name,
    photo,
    phoneNo,
    email,
    password,
    passwordConfirm,
  });
  console.log(user);
  resAndSendToken(user, res, 201);
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
