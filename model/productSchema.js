const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;
const category = require("../model/categoryModel")


const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'category',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offer: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  images: {
    image1: {
      type: String,
      required: true
    },
    image2: {
      type: String,
      required: true
    }
    , image3: {
      type: String,
      required: true
    }
    , image4: {
      type: String,
      required: true
    }
  },
  is_blocked: {
    type: Boolean,
    default: false,
    required: true
  }
});

const product = mongoose.model("product", productSchema);
module.exports = product;