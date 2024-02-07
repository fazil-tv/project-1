
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
        console.log(req.session.user)
        const userId = req.session.user_id;
        console.log(userId);
        const userData = await userSchema.findById(userId);
        console.log(userData);
        const address = await addressSchema.findOne({ user: userId });
        console.log(address, 'adresssss');
        const cartData = await cartSchema.findOne({ user: userId }).populate('products').populate('couponDiscount')

        const currentDate = new Date();
        const coupon = await couponSchema.find({ expiryDate: { $gte: currentDate }, is_blocked: false });

        // const coupondiscount = cartData.couponDiscount ? cartData.couponDiscount.discountPercentage : 0;
        let coupondiscount = 0;
        if (cartData.couponDiscount) {
            coupondiscount = cartData.couponDiscount.discountPercentage;
        }

        // console.log(coupondiscount, "$$$$$$%%%%%%$$$$", cartData.couponDiscount.discountPercentage)

        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);
        console.log(subtotel, "rrt");



        // const discountamount = subtotel - coupondiscount;
        let discountamount;
        if (cartData.couponDiscount) {
            discountamount = (coupondiscount / 100) * subtotel;
        } else {
            discountamount = subtotel
        }

        console.log("######", discountamount)
        console.log(coupon);
        console.log(cartData);
        res.render('checkout', { address, cartData, subtotel, coupon, discountamount, coupondiscount, userData });
    } catch (error) {
        console.log(error);
    }
}


const checkoutPost = async (req, res) => {

    try {

        const userId = req.session.user_id;
        console.log(userId, 'userr');
        const user = await userSchema.findOne({ _id: userId })
        const cartData = await cartSchema.findOne({ user: userId });

        console.log(cartData.products, "llllllllllll");




        console.log(cartData, "kmmmmm");

        const { jsonData } = req.body;

        const selectedAddress = jsonData.selectedAddress
        const deliveryAddressObjectId = new ObjectId(selectedAddress);
        console.log(deliveryAddressObjectId)
        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );
        console.log("lockone", userAddress);

        const selectedpayament = jsonData.payment

        let status = selectedpayament == "Cash on delivery" ? "placed" : "pending"



        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);

        console.log("user", user);
        console.log("cartdata", cartData);
        console.log("body here", req.body);
        console.log("selectedaddress", selectedAddress);
        console.log("payment", selectedpayament);




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
        console.log(subtotel, "rrt");


        // const discountAmount = (coupondiscount / 100) * subtotelamount;



        // const discountamount = subtotelamount - coupondiscount;
        let discountamount;
        if(cartDatas.couponDiscount){
             discountamount = (coupondiscount / 100) * subtotelamount;
            //  discountamount = ((subtotelamount - coupondiscount) / subtotelamount) * 100;

        }else{
            discountamount = subtotelamount
        }


        console.log("******", discountamount);

        const count = 1000;
        const generatedId = await orderSchema.countDocuments()+count

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
        console.log(order);

        const orderId = order._id;
        console.log(orderId);

        if (order.orderStatus === "placed") {
            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                console.log(product);
                console.log(count);
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

                console.log(product);
                console.log(count);
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
                console.log("errorrr", order);
                console.log("klklklkl");
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
        console.log("mmm");
        const id = req.query.id;
        const orders = await orderSchema.findOne({ _id: id }).populate('products.productId');
        console.log(orders, "klklklk");
        const deliveryAddressObjectId = new mongoose.Types.ObjectId(orders.delivery_address);
        console.log(deliveryAddressObjectId, 'jkjk')
        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );
        console.log(userAddress);

        res.render('orderstatus', { orders, userAddress });
    } catch (error) {
        console.log(error.message);
    }

}


const cancelorder = async (req, res) => {
    console.log("hiiii");
    // const orderId = req.body.orderId;

    const productId = req.body.productId;
    const id = req.body.id;
    const orderId = req.body.orderId;

    console.log("p", productId)
    console.log("i", id)
    console.log("o", orderId)




    console.log("here ", productId);

    try {
        const userId = req.session.user_id;
        console.log(userId);



        const orderdata = await orderSchema.findOne({ 'products._id': productId });
        const index = orderdata.products.findIndex((item) => {
            return item._id.toString() === productId;
        });
        orderdata.products[index].productstatus = "canceled";
        await orderdata.save();



        const updatedOrders = await orderSchema.findById(orderId)

        console.log(updatedOrders, "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%****");
        if (updatedOrders.payment !== 'Cash on delivery') {

            const product = updatedOrders.products.find((products) => products.productId.toString() === id);

            const walletamount = product.totalPrice;
            const data = {
                amount: walletamount,
                date: Date.now(),
            }
            // await orderSchema.findById(orderId)
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

    console.log("hiiii");
    const productId = req.body.productId;
    const id = req.body.id;
    const orderId = req.body.orderId;
    console.log("here ", productId);


    try {
        const userId = req.session.user_id;
        console.log(userId);



        const orderdata = await orderSchema.findOne({ 'products._id': productId });
        console.log(orderdata, "##########")
        const index = orderdata.products.findIndex((item) => {
            return item._id.toString() === productId;
        });
        orderdata.products[index].productstatus = "return";
        await orderdata.save();


        const updatedOrders = await orderSchema.findById(orderId)
        console.log(updatedOrders, "klllllllllll");
        const product = updatedOrders.products.find((products) => products.productId.toString() === id);
        console.log(product, "klllllllllll");

        const walletamount = product.totalPrice;
        console.log(walletamount, "%%%%%%%$$$$");

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
        console.log(user, "userssssss");


        console.log(responce, "responce");
        console.log(order, "order");


        const cartData = await cartSchema.findOne({ user: userId })
        console.log(cartData);

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SCRETKEY);
        hmac.update(responce.razorpay_order_id + "|" + responce.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");

        if (hmacValue == responce.razorpay_signature) {

            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                console.log(product);
                console.log(count);
                await productSchema.updateOne({ _id: product }, { $inc: { quantity: -count } })
            }

            // const addressStatus = await orderSchema.findByIdAndUpdate({ _id: order.receipt }, { $set: { orderStatus: "placed" },{products.productstatus:"placed"} },{ new: true } );
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

            console.log(addressStatus, "heeeyyyyy");



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