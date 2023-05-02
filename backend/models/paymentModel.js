const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    paid:{
        type: Number,
    },
    paidAt:{
        type: Date,
        default: Date.now
    },
    customer:{
        type: mongoose.Schema.ObjectId,
        ref:'Customer',
        required: [true, 'Must have a customer with an payment']
    }
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
})

// paymentSchema.virtual('totalPrice').get(function(){
//     return this.price*this.quantity
// })

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment;