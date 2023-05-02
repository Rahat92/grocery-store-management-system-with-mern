const User = require("../models/userModel")
const AppError = require("../uitls/AppError")
const catchAsyncError = require("../utils/catchAsyncError")
const jwt = require('jsonwebtoken')
const multer = require('multer')
const {promisify} = require('util')
const tokenProducer = (id) => {
    return jwt.sign({id},process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRE_TOKEN,
    })
}
const resAndSendToken = (user, res, statusCode) => {
    const token = tokenProducer(user._id);
    const cookieOptions = {
        expires: new Date(Date.now()+10*24*60*60*1000),
        httpOnly: true
    }
    res.cookie('token', token, cookieOptions)
    if(process.env.NODE_ENV === 'PRODUCTION') cookieOptions.secure = true;
    res.status(statusCode).json({
        status: 'success',
        token, 
        user
    })
}

exports.protect = catchAsyncError(async(req,res,next) => {
    console.log('hello world');
    const {token} = req.cookies
    if(!token) return next(new AppError(`You are now not logged in, Please log in first`,400))
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY)
    console.log(decoded);
    const currentUser = await User.findById(decoded.id)
    console.log('currentUser => ', currentUser);
    if(!currentUser) return next(new AppError(`The user belonging this token is no longer exist`,400))
    if(currentUser.isPasswordChanged(decoded.iat)) return next(new AppError(`The user changed password after issuing this  token, Please log in again`,400))
    req.user = currentUser;
    next()
})

exports.restrictedTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) return next(new AppError(`You are not allowed to perform this action`, 400))
        next()
    }
}


exports.signUp = catchAsyncError(async (req,res,next) => {
    const {name, email, password, passwordConfirm} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm
    })
    console.log(user);
    resAndSendToken(user, res, 201 )
})

exports.logIn = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
    if(!email || !password) return next(new AppError(`Please Provide Email and Password`, 400))
    const user = await User.findOne({email}).select('+password')
    if(!user || !(await user.isPasswordMatched(password))) return next(new AppError(`Invalid email or password!`, 400))
    resAndSendToken(user, res, 200)
})

exports.logOut = catchAsyncError(async(req,res,next) => {
    res.cookie('token',null,{
      expires:new Date(Date.now()),
      httpOnly:true
    })
    res.status(200).json({
      status:'success',
      message:'Logged Out'
    })
})