const mongoose = require('mongoose');

const address = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    address: [
        {
            fullname: {
                type: String,
                required: true,
                trim: true
            },
            mobile: {
                type: Number,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                trim: true
            },
            houseName: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            pin: {
                type: String,
                required: true,
                trim: true
            }

        }
    ]

})


const addressSchema = mongoose.model('address',address);
module.exports = addressSchema;
