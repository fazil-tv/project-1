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
    try {
        if (req.session.user_id) {
            console.log("here");
            const userId = req.session.user_id;
            const cartData = await cartSchema.findOne({ user: userId }).populate('products.productId');
            console.log("ok set", cartData);
            res.render('cart', { cartData });
        } else {
            console.log('not sesssiojn')
        }


    } catch (erorr) {
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
            res.json({ status: "cart already added" });
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



const removecarts = async (req, res) => {
    try {
        const productId = req.body.productId;
        console.log(productId);
        const userId = req.session.user_id;
        console.log(userId);

        console.log(("done"));

        // const removecart = await cartSchema.findOneAndUpdate({'user':userId},{$pull:{'products':{
        //     productId:productId}}},{new:true})
        const removecart = await cartSchema.findOneAndUpdate(
            { 'user': userId },
            { $pull: { 'products': { _id: productId } } },
            { new: true }
        );

        console.log("remove cart", removecart)

        if (removecart) {
            res.json({ success: true });
            console.log("done done")
        } else {
            res.status(404).json({ error: 'Product not found in the cart' });
        }

    } catch (error) {
        console.log(error);
    }

}



const updatecart = async (req, res) => {
    try {

        const userId = req.session.user_id
        const productId = req.body.productId;
        const currentQuantity = req.body.currentQuantity;

        console.log("userId", userId);
        console.log("productId", productId);
        console.log("curentquantity", currentQuantity);

        const updateuser = await cartSchema.findOneAndUpdate(
            { user: userId, 'products.productId': productId },
            { $set: { 'products.$.count': currentQuantity } },
            { new: true }
        );
        console.log(updateuser);

        if (!updateuser) {
            res.status(404).json({ message: "User or product not found in the cart." });
        }
        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
}






module.exports = {
    cart,
    getcart,
    removecarts,
    updatecart
}

