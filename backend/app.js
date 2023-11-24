const express = require('express');
const app = express()
const userRouter = require('./routes/userRoutes');
const AppError = require('./uitls/AppError');
const errorControlller = require('./controllers/errorControlller');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoutes');
const customerRouter = require('./routes/customerRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const cartRouter = require('./routes/cartRoutes');
const bikriRouter = require('./routes/bikriRoutes');
const categoryRouter = require('./routes/categoryRoutes');
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/customers', customerRouter)
app.use('/api/v1/paid', paymentRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/bikri', bikriRouter)
app.use('/api/v1/category', categoryRouter)
app.all('*', (req,res,next) => {
    next(new AppError('No route defined by this url', 400))  
})
app.use(errorControlller)
module.exports = app;