const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        // enum: ['Pen', 'Pencil', 'Rubber', 'Graph']
    },
    quantity:{
        type: Number,
        min: 1,
        required: [true, 'You must have to specify the quantity']
    },
    price:{
        type: Number,
        min: 5,
        required: [true, 'You must have to specify the price']
    },
    photo: {
        type: String,
        default: 'default.png',
    }
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
})

// productSchema.virtual('totalPrice').get(function(){
//     return this.price*this.quantity
// })

const Product = mongoose.model('Product', productSchema)
module.exports = Product;