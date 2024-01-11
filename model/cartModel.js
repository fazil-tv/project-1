
const mongoose = require('mongoose');

const cart = new mongoose.Schema({
    user: {
      type: String,
      required: true,
      ref: "users",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product",
        },
        count: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
      },
    ]
})

const cartSchema = mongoose.model('cart',cart);
module.exports = cartSchema;