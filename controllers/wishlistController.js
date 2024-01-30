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
const wishlistSchema = require("../model/wishlistModel");




const wishlist = async (req, res) => {
    try {
        if (req.session.user_id) {
            console.log("here");
            const wishlist = await wishlistSchema.findOne({}).populate('product.productId');
            console.log(wishlist);
            res.render('wishlist', { wishlist });
        } else {
            console.log('not sesssion');
        }

    } catch (erorr) {
        console.log(error)
    }
}

const getwishlist = async (req, res) => {
    try {
        console.log("hmmmmm")
        if (req.session.user_id) {
            const productId = req.body.productId;
            const userId = req.session.user_id;


            console.log(productId);

            const wishlistproduct = await wishlistSchema.findOne({ user: userId, 'product.productId': productId })

            if (wishlistproduct) {
                console.log("kkkkkkkk")
                const userId = req.session.user_id;


                await wishlistSchema.findOneAndUpdate(
                    { user: userId, 'product.productId': productId },
                    { $pull: { 'product': { 'productId': productId } } }
                );
                console.log(wishlistSchema);

                res.json({ status: true, productId: productId });
            } else {

                console.log("lllllo", productId);
                const data = {
                    productId: productId,
                };
                const userId = req.session.user_id;
                await wishlistSchema.findOneAndUpdate(

                    { user: userId },
                    { $addToSet: { product: data } },
                    { upsert: true, new: true }
                );

                res.json({ status: false, productId: productId });

            }
        } else {
            res.json({ user: true })
        }

    } catch (erorr) {
        console.log(error)
    }
}

const removewishlist = async (req, res) => {
    try {
        console.log("klklklk")

        const productId = req.body.productId;
        const userId = req.session.user_id;
        console.log(productId);
       const wishlist =   await wishlistSchema.findOneAndUpdate(
        { user: userId},
        { $pull: { 'product': { '_id': productId } } },{new:true});

        console.log(wishlist,"hmmmmmmmmm");

            if(wishlist){
                res.json({status:true})

            }else{
                res.json({status:false});

            }
        } catch (erorr) {
        console.log(error);
    }
}

module.exports = {
    wishlist,
    getwishlist,
    removewishlist
}