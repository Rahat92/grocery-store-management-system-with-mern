const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "must have a customer name"],
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
      // required: [true, "Must have a customer photo"],
    },
    phoneNo: {
      type: String,
      required: [true, "You must have to provide a unique number"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password not matched!",
      },
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangeAt: Date,
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


customerSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now()-1000
})
customerSchema.methods.isPasswordMatched = async function (candidatePass) {
  console.log('my pass: ', candidatePass, this);
  return await bcrypt.compare(candidatePass, this.password)
}

customerSchema.methods.isPasswordChanged = function(jwtTimeStamp){
  if(this.passwordChangeAt){
      const passwordChangedAt = parseInt(this.passwordChangeAt/1000, 10)
      return passwordChangedAt > jwtTimeStamp
  }
  return false
}
customerSchema.pre('save', async function(next){
  this.password = await bcrypt.hash(this.password, 10)
  this.passwordConfirm = undefined
})
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
