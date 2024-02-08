const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
const product = require("../model/productSchema");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "users",
  },
  product: [{
    productId: {
      type: String,
      required: true,
      ref: "product",
    },
  }],
});
module.exports = mongoose.model("Wishlist", wishlistSchema);

