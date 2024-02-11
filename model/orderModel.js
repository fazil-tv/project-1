const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    delivery_address:{
       type:mongoose.Types.ObjectId,
       ref:'address',
       required:true
      },
      payment: {
        type: String,
        required: true,
        method: ['Cash on delivery']
      },
      orderId:{
        type:Number,
        required:true
      },
      products: [{
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'product',
          required: true
        },
        productstatus:{
          type:String,
          required:true
        },
        returnreason:{
          type:String,
        },
        count: {
          type: Number,
          required: true
        },
        price:{
            type: Number,
            required: true
          },
          totalPrice: {
          type: Number,
          default: 0
        }
      }],
      subtotal: {
        type: Number,
        required:true
      },
      orderStatus: {
        type: String,
        default: 'pending'
      },
      invoice:{
        type:Boolean,
        default:false
      },
      orderDate: {
        type: Date,
        default: Date.now,
        required: true
      }
    })


    const Order = mongoose.model('Orders',orderSchema);
    module.exports = Order

