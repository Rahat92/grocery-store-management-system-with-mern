const mongoose = require("mongoose");
const Product = require("./productModel");
const bikriSchema = new mongoose.Schema(
  {
    quantity: [
      {
        type: Number,
        required: [true, "must have an quantity"],
      },
    ],

    totalAmount: [
      {
        type: Number,
        required: [true, "must have totalAmount"],
      },
    ],
    payAmount: {
      type: Number,
      default: 0,
    },

    // totalBikri: {
    //     type: Number,
    // },
    productName: [
      {
        type: String,
        required: [true, "must have a product name"],
      },
    ],

    productId: [
      {
        type: String,
        required: [true, "must have a product Id"],
      },
    ],
    totalBuyAmount: [
      {
        type: Number,
        required: [true, "must have a product buy price"],
      },
    ],
    productPrice: [
      {
        type: Number,
        required: [true, "must have a product price"],
      },
    ],
    productBuyPrice: [
      {
        type: Number,
        required: [true, "must have a product buy price"],
      },
    ],
    cartAt: {
      type: Date,
      default: Date.now,
    },
    // product:[{
    //     type: mongoose.Schema.ObjectId,
    //     ref:'Product',
    //     // required: [true, 'must have a product under a cart']
    // }],
    customerId: {
      type: String,
      // required:[true, 'must have a customer id']
    },

    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: [true, "must have a customer under a cart"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// bikriSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "customer",
//   });
//   next();
// });
bikriSchema.virtual("totalBikri").get(function () {
  return this.totalAmount.reduce((f, c) => f + c, 0);
});
bikriSchema.virtual("isPaid").get(function () {
  return this.totalAmount.reduce((f, c) => f + c, 0) === this.payAmount
    ? true
    : false;
});
bikriSchema.virtual("kroyMullo").get(function () {
  return this.totalBuyAmount.reduce((f, c) => f + c, 0);
});
bikriSchema.virtual("dueAmount").get(function () {
  return this.totalAmount.reduce((f, c) => f + c, 0) - this.payAmount;
});
bikriSchema.post("save", async function () {
  const productsIds = this.productId;
  const products = await Promise.all(
    productsIds.map(async (el, i) => {
      return await Product.findById(el);
    })
  );
  products.map(async (el, i) => {
    if (this.quantity[i] <= el.quantity * 1) {
      await el.updateOne({
        quantity: el.quantity - this.quantity[i],
      });
    }
  });
});

// bikriSchema.index({ productName: 1 }, { unique: true });
const Bikri = mongoose.model("Bikri", bikriSchema);

module.exports = Bikri;
