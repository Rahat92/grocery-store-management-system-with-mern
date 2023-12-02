const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "must have a customer name"],
    },
    photo: {
      type: String,
      required:[true, 'Must have a customer photo']
    },
    phoneNo: {
      type: String,
      required: [true, "You must have to provide a unique number"],
      unique: true,
    },
    // password:{
    //     type: String,
    //     required: [true, 'must have a password']
    // },
    // passwordConfirm:{
    //     type: String,
    //     required:[true, 'must have a passwordConfirm']
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// customerSchema.virtual('product',{
//     ref:'Product',
//     foreignField:'customer',
//     localField:'_id'
// })

customerSchema.virtual("paid", {
  ref: "Payment",
  foreignField: "customer",
  localField: "_id",
});
customerSchema.virtual("cart", {
  ref: "Bikri",
  foreignField: "customer",
  localField: "_id",
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
