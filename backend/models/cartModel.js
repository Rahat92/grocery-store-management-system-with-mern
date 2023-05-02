const mongoose = require('mongoose');
const Product = require('./productModel');
const cartSchema = new mongoose.Schema({
    quantity:{
        type: Number,
        required:[true, 'must have an quantity']
    },
    totalAmount:{
        type: Number,
        required:[true, 'must have totalAmount']
    },
    productName:{
        type: String,
        required:[true, 'must have a product name']
    },
    productPrice:{
        type: String,
        required:[true, 'must have a product price']
    },
    cartAt:{
        type:Date,
        default: Date.now
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref:'Product',
        required: [true, 'must have a product under a cart']
    },
    customerId:{
        type:String,
        required:[true, 'must have a customer id']
    },
    
    customer:{
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: [true, 'must have a customer under a cart']
    }
})

cartSchema.methods.cartsCalculate = async function(productId){
    console.log('this', this.quantity)
    const product = await Product.findById(productId)
    await product.updateOne({quantity: product.quantity- this.quantity})
}


// cartSchema.post('save', function(){
//     this.constructor.cartsCalculate(this.product)
// })

// cartSchema.pre(/^find/,function(){
//     this.find().populate({
//         path: 'product',
//         select:'name quantity _id'
//     })
// })
const Cart = mongoose.model('Cart', cartSchema)


module.exports = Cart;