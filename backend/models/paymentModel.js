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

paymentSchema.virtual('totalPayments').get(function(){
    let total = []
    total.push(this.paid)
    console.log(total.reduce((f,c) => f+c));
})
paymentSchema.pre(/^find/, function () {
    this.populate('customer')
})
const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment;