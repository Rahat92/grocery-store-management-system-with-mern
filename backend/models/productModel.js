const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Must have a Category"],
    },
    productCategory: {
      type: String,
      required: [true, "Must have a Product Category"],
    },
    quantity: {
      type: Number,
      min: 1,
      required: [true, "You must have to specify the quantity"],
    },
    buyPrice: {
      type: Number,
      required: [true, "You must have to specify the buy price"],
    },
    price: {
      type: Number,
      min: 5,
      required: [true, "You must have to specify the price"],
    },
    photo: {
      type: String,
      default: "default.png",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.virtual('totalPrice').get(function(){
//     return this.price*this.quantity
// })
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
  });
  next();
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
