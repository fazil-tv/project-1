
const userSchema = require("../model/userSchema");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
const cartSchema = require("../model/cartModel");
const orderSchema = require('../model/orderModel');
const { json } = require("express");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Razorpay = require('razorpay');
const { config } = require("dotenv");
require('dotenv').config();
const crypto = require("crypto")

const couponSchema = require("../model/couponModel");


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SCRETKEY
})




const checkout = async (req, res) => {

    try {




        const userId = req.session.user_id;

        const cart = await cartSchema.find({ user: userId });

        if (cart.length > 0) {

            const userData = await userSchema.findById(userId);

            const address = await addressSchema.findOne({ user: userId });

            const cartData = await cartSchema.findOne({ user: userId }).populate('products').populate('couponDiscount')

            const currentDate = new Date();
            const coupon = await couponSchema.find({ expiryDate: { $gte: currentDate }, is_blocked: false });


            let coupondiscount = 0;
            if (cartData.couponDiscount) {
                coupondiscount = cartData.couponDiscount.discountPercentage;
            }



            const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);





            let discountamount;
            if (cartData.couponDiscount) {
                discountamount = (coupondiscount / 100) * subtotel;
            } else {
                discountamount = subtotel
            }

            res.render('checkout', { address, cartData, subtotel, coupon, discountamount, coupondiscount, userData });
        } else {
            res.redirect('/shop');
        }
    } catch (error) {
        console.log(error);
    }
}


const checkoutPost = async (req, res) => {

    try {

        const userId = req.session.user_id;

        const user = await userSchema.findOne({ _id: userId })
        const cartData = await cartSchema.findOne({ user: userId });








        const { jsonData } = req.body;

        const selectedAddress = jsonData.selectedAddress
        const deliveryAddressObjectId = new ObjectId(selectedAddress);
     
        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );


        const selectedpayament = jsonData.payment

        let status = selectedpayament == "Cash on delivery" ? "placed" : "pending"



        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);







        const orderItems = cartData.products.map((product) => ({
            productId: product.productId,
            count: product.count,
            price: product.price,
            totalPrice: product.totalPrice,
            productstatus: (status === "pending") ? "pending" : "placed"
        }));


        const cartDatas = await cartSchema.findOne({ user: userId }).populate('products').populate('couponDiscount')
        let coupondiscount = 0;
        if (cartDatas.couponDiscount) {
            coupondiscount = cartDatas.couponDiscount.discountPercentage;


        }
        const subtotelamount = cartDatas.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);
      

        let discountamount;
        if (cartDatas.couponDiscount) {
            discountamount = (coupondiscount / 100) * subtotelamount;
            //  discountamount = ((subtotelamount - coupondiscount) / subtotelamount) * 100;

        } else {
            discountamount = subtotelamount
        }




        const count = 1000;
        const generatedId = await orderSchema.countDocuments() + count

        const order = new orderSchema({
            user: userId,
            delivery_address: selectedAddress,
            payment: selectedpayament,
            orderId: generatedId,
            products: orderItems,
            subtotal: discountamount,
            orderStatus: status,
            orderDate: new Date(),
        })
        await order.save();
     

        const orderId = order._id;
 

        if (order.orderStatus === "placed") {
            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                await productSchema.updateOne({ _id: product }, { $inc: { quantity: -count } })
            }
            await cartSchema.deleteOne({ user: userId });
            res.json({ status: 'success', message: "product placed succesfully" });


        } else if (selectedpayament == "Wallet") {


            const data = {
                amount: -discountamount,
                date: Date.now(),
            }
            await userSchema.findOneAndUpdate({ _id: userId }, { $inc: { wallet: -discountamount }, $push: { walletHistory: data } })
            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                await productSchema.updateOne({ _id: product }, { $inc: { quantity: -count } })
            }
            await cartSchema.deleteOne({ user: userId });


            const addressStatus = await orderSchema.findByIdAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        orderStatus: "placed",
                        "products.$[].productstatus": "placed"
                    }
                },
                { new: true }
            );
            res.json({ status: 'success', message: "product placed succesfully" });



        } else {
            const options = {
                amount: discountamount * 100,
                currency: 'INR',
                receipt: "" + orderId,
            };

            razorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                }

                res.json({ status: "false", message: "product placed succesfully", order, subtotel });
            });

        }
    } catch (err) {
        console.log(err);
    }
}

const success = async (req, res) => {
    try {

        res.render("success");
    } catch (error) {
        console.log(error.message);
    }
}

const orderstatus = async (req, res) => {
    try {

        const id = req.query.id;
        const orders = await orderSchema.findOne({ _id: id }).populate('products.productId');
        const deliveryAddressObjectId = new mongoose.Types.ObjectId(orders.delivery_address);

        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );

        res.render('orderstatus', { orders, userAddress });
    } catch (error) {
        console.log(error.message);
    }

}


const cancelorder = async (req, res) => {


    const productId = req.body.productId;
    const id = req.body.id;
    const orderId = req.body.orderId;



    try {
        const userId = req.session.user_id;
        const orderdata = await orderSchema.findOne({ 'products._id': productId });
        const index = orderdata.products.findIndex((item) => {
            return item._id.toString() === productId;
        });
        orderdata.products[index].productstatus = "canceled";
        await orderdata.save();
        const updatedOrders = await orderSchema.findById(orderId)
        if (updatedOrders.payment !== 'Cash on delivery') {

            const product = updatedOrders.products.find((products) => products.productId.toString() === id);

            const walletamount = product.totalPrice;
            const data = {
                amount: walletamount,
                date: Date.now(),
            }

            await userSchema.findOneAndUpdate({ _id: userId }, { $inc: { wallet: walletamount }, $push: { walletHistory: data } })

        }
        for (let i = 0; i < orderdata.products.length; i++) {

            let product = orderdata.products[i].productId;
            let count = orderdata.products[i].count;

            await productSchema.updateOne({ _id: product }, { $inc: { quantity: count } })
        }

        res.json({ status: "success" });

    } catch (error) {
        console.log(error);
    }

}


const returnorders = async (req, res) => {


    const productId = req.body.productId;
    const id = req.body.id;
    const orderId = req.body.orderId;
    const returnReason = req.body.returnReason;
    try {
        const userId = req.session.user_id;
        const orderdata = await orderSchema.findOne({ 'products._id': productId });
        const index = orderdata.products.findIndex((item) => {
            return item._id.toString() === productId;
        });
        orderdata.products[index].productstatus = "return";
        await orderdata.save();
        await orderSchema.updateMany({}, { $set: { "products.$[].returnreason": returnReason } });
        const updatedOrders = await orderSchema.findById(orderId)
        const product = updatedOrders.products.find((products) => products.productId.toString() === id);
        const walletamount = product.totalPrice;
        const data = {
            amount: walletamount,
            date: Date.now(),
        }
        for (let i = 0; i < orderdata.products.length; i++) {
            let product = orderdata.products[i].productId;
            let count = orderdata.products[i].count;
            await productSchema.updateOne({ _id: product }, { $inc: { quantity: count } })

        }
        await userSchema.findOneAndUpdate({ _id: userId }, { $inc: { wallet: walletamount }, $push: { walletHistory: data } })

        res.json({ status: "success" });


    } catch (error) {
        console.log(error);
    }

}




const verifyPayment = async (req, res) => {

    try {
        const responce = req.body.responce;
        const order = req.body.order;

        const userId = req.session.user_id;

        const user = await userSchema.findOne({ _id: userId });



        const cartData = await cartSchema.findOne({ user: userId })


        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SCRETKEY);
        hmac.update(responce.razorpay_order_id + "|" + responce.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");

        if (hmacValue == responce.razorpay_signature) {

            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                await productSchema.updateOne({ _id: product }, { $inc: { quantity: -count } })
            }

            const addressStatus = await orderSchema.findByIdAndUpdate(
                { _id: order.receipt },
                {
                    $set: {
                        orderStatus: "placed",
                        "products.$[].productstatus": "placed"
                    }
                },
                { new: true }
            );

            await cartSchema.deleteOne({ user: userId });
            res.json({ status: 'success', message: "product placed succesfully" });

        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    checkout,
    checkoutPost,
    success,
    orderstatus,
    cancelorder,
    verifyPayment,
    returnorders

}