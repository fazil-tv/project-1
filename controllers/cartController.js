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
            console.log('not sesssion');
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
                count: 1,
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
    console.log("ok");
    try {
        const userId = req.session.user_id;
        const productId = req.body.productId;
        const count = req.body.count;
        const product = await productSchema.findById(productId);
        const totalprice = product.price*count;
        console.log("naaah",totalprice)
        const cartData = await cartSchema.findOne({ user: userId });
        console.log(count)
        console.log(totalprice);
        console.log("kiki",product.quantity);
        console.log("productoooo",product);

        if (count === -1) {
            const currentQuantity = cartData.products.find((p) => p.productId == productId).count;
            if (currentQuantity <= 1) {
                return res.json({ success: false, message: 'Quantity cannot be decreased further.' });
            }
        }

        if (count === 1) {
            const currentQuantity = cartData.products.find((p) => p.productId == productId).count;
            if (currentQuantity + count > product.quantity) {
                return res.json({ success: false, message: 'Stock limit reached' });
            }
        }

        console.log("userId", userId);
        console.log("productId", productId);
        console.log("currentQuantity", count);

        const updateuser = await cartSchema.findOneAndUpdate(
            { user: userId, 'products.productId': productId },
            {
                $inc: {
                    'products.$.count': count,
                    'products.$.totalPrice': totalprice
                }
            },
            { new: true }
        );

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'An error occurred.' });
    }
};








module.exports = {
    cart,
    getcart,
    removecarts,
    updatecart
}

