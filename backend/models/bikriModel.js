const mongoose = require('mongoose');
const Product = require('./productModel');
const bikriSchema = new mongoose.Schema({

    quantity:[{
        type: Number,
        required:[true, 'must have an quantity']
    }],
    
    totalAmount:[{
        type: Number,
        required:[true, 'must have totalAmount']
    }],

    productName:[{
        type: String,
        required:[true, 'must have a product name']
    }],

    productId:[{
        type: String,
        required:[true, 'must have a product Id']
    }],

    productPrice:[{
        type: Number,
        required:[true, 'must have a product price']
    }],

    cartAt:{
        type:Date,
        default: Date.now
    },
    // product:[{
    //     type: mongoose.Schema.ObjectId,
    //     ref:'Product',
    //     // required: [true, 'must have a product under a cart']
    // }],
    customerId:{
        type:String,
        // required:[true, 'must have a customer id']
    },
    
    customer:{
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: [true, 'must have a customer under a cart']
    }
})

bikriSchema.post('save', async function(){
    const productsIds = this.productId;
    console.log(productsIds);
    const quantitys = this.quantity;
    console.log(quantitys[0]);
    const products = await Promise.all(productsIds.map(async(el,i) => {
        return await Product.findById(el)
        // products.push(my)
    }))
    console.log(products);
    console.log(this.quantity);
    products.map(async(el, i) => {
        if(this.quantity[i]<=el.quantity){
            await el.updateOne({
                quantity: el.quantity-this.quantity[i]
            })
        }
    })
})

const Bikri = mongoose.model('Bikri', bikriSchema)


module.exports = Bikri;