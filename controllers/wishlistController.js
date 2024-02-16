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
            const wishlist1 = await wishlistSchema.find({user:req.session.user_id})
            console.log(wishlist1,"mmmm");
            const wishlist = await wishlistSchema.findOne({user:req.session.user_id}).populate({
                path: 'product.productId',
                populate: {
                    path: 'category',
                    populate: {
                        path: 'offer'
                    }
                },
                populate: {
                    path: 'offer'
                }
            });
    
            console.log(wishlist,"wishliST ALL");
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
        if (req.session.user_id) {
            const productId = req.body.productId;
            const userId = req.session.user_id;

            const wishlistproduct = await wishlistSchema.findOne({ user: userId, 'product.productId': productId })

            if (wishlistproduct) {
                const userId = req.session.user_id;
                await wishlistSchema.findOneAndUpdate(
                    { user: userId, 'product.productId': productId },
                    { $pull: { 'product': { 'productId': productId } } }
                );



                res.json({ status: true, productId: productId });
            } else {

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

        const productId = req.body.productId;
        const userId = req.session.user_id;
       const wishlist =   await wishlistSchema.findOneAndUpdate(
        { user: userId},
        { $pull: { 'product': { '_id': productId } } },{new:true});


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