const mongoose = require("mongoose");

const category = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        uniqe: true
    },
    discription: {
        type: String,
        required: true,
    },
    offer: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'offer',
      },
      discountedPrice: Number,
    is_list: {
        type: Boolean,
        default: false
    },
});

const categorySchema = mongoose.model("category", category);
module.exports = categorySchema


