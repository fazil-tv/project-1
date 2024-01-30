const mongoose = require("mongoose");

const couponModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    couponCode: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    activationDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    criteriaValue: {
        type: Number,
        required: true,
    },
    usedUsers: {
        type: Array,
        ref: "User",
        default: [],
    },
    is_blocked: {
        type: Boolean,
        default: false,
    }
});

const CouponModel = mongoose.model('coupon',couponModel);
module.exports = CouponModel;

