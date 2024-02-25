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
            const userId = req.session.user_id;

            const cartData = await cartSchema.findOne({ user: userId }).populate({
                path: 'products.productId',
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

         
            res.render('cart', { cartData });
        } else {
            console.log('not sesssion');
        }


    } catch (erorr) {
        res.status(500).render('500');
    }

}


const getcart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const productId = req.body.productId;
        const productdata = await productSchema.findById(productId).populate({
            path: 'category',
            populate: {
                path: 'offer'
            }
        })
            .populate({
                path: 'offer'
            })


        let productprice


        if (productdata.category.offer) {

            productprice = productdata.discountedPrice;

        } else if (productdata.offer) {
             productprice = productdata.discountedPrice;

        } else {
         
             productprice = productdata.price;
        }


        const cartproduct = await cartSchema.findOne({ user: userId, 'products.productId': productId });

        const productcount = productdata.quantity;
        

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
        res.status(500).render('500');
    }
}



const removecarts = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.session.user_id; 
        const removecart = await cartSchema.findOneAndUpdate(
            { 'user': userId },
            { $pull: { 'products': { _id: productId } } },
            { new: true }
        );


        if (removecart) {
            res.json({ success: true });
           
        } else {
            res.status(404).json({ error: 'Product not found in the cart' });
        }

    } catch (error) {
        res.status(500).render('500');
    }

}



const updatecart = async (req, res) => {
    console.log("ok");
    try {
        const userId = req.session.user_id;
        const productId = req.body.productId;
        const count = req.body.count;
 




        const product = await productSchema.findById(productId).populate({
            path: 'category',
            populate: {
                path: 'offer'
            }
        })
            .populate({
                path: 'offer'
            })


        let totalprice


        if (product.category.offer) {

            console.log("count", count)
            console.log("count", product.discountedPrice)



            totalprice = product.discountedPrice * count;




        } else if (product.offer) {
            console.log("productoffer")
            totalprice = product.discountedPrice * count;
            console.log(product.discountedPrice, "productdiscountedPrice");




        } else {
            console.log("normal")
            totalprice = product.price * count;
        }

        console.log(totalprice, 'tottll');



        const cartData = await cartSchema.findOne({ user: userId });


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

