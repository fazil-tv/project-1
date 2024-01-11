const User = require("../model/userSchema");
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const nodemailer = require("nodemailer");
const Otp = require('../model/userOTPverification')
const bcrypt = require("bcrypt");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
const cartSchema = require("../model/cartModel")
const { log, count, error } = require("console");
const product = require("../model/productSchema");




const cart = async (req, res) => {
    try{
        if( req.session.user_id){    
            console.log("here"); 
            const userId = req.session.user_id;
            const cartData = await  cartSchema.findOne({user:userId}).populate('products.productId');
            console.log("ok set",cartData);
           res.render('cart',{cartData});
        }else{
            console.log('not sesssiojn')
        }


    }catch(erorr){
        console.log(error)
    }

    // res.render('cart',{cartproduct:cartproduct});
}


const getcart = async (req, res) => {
    try {
        console.log("what is this happend");
        const userId = req.session.user_id;
        console.log(userId)
        const productId = req.body.productId;
        console.log(productId);

        const productdata = await productSchema.findById(productId);
        const cartproduct = await cartSchema.findOne({ user: userId, 'products.productId': productId });
        const productprice = productdata.price;
        const productcount = productdata.quantity
        console.log(cartproduct);

            if (cartproduct) {
                res.json({  status: "cart already added" });
            }            
            else {
                const data = {
                    productId: productId,
                    count: productcount,
                    price: productprice,
                    totalPrice: productprice
                }
                

                await cartSchema.findOneAndUpdate(
                    { user: userId },
                    { $set: { user: userId }, $push: { products: data } },
                    { upsert: true, new: true }
                );

                res.json({ success: true })
            }
           

        
    } catch (error) {
        console.log(error);
    }
}















module.exports = {
    cart,
    getcart
}

// exports.getCart={
//     cart

// }

// exports.postCart={


// }
