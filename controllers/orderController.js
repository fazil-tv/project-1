
const userSchema = require("../model/userSchema");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
const cartSchema = require("../model/cartModel");
const orderSchema = require('../model/orderModel');
const { json } = require("express");
const mongoose = require('mongoose');




const checkout = async (req, res) => {
    try {
        console.log(req.session.user)
        const userId = req.session.user_id;
        console.log(userId);
        const userData = await userSchema.findById(userId);
        console.log(userData);
        const address = await addressSchema.findOne({ user: userId });
        console.log(address, 'adresssss');
        const cartData = await cartSchema.findOne({ user: userId }).populate('products');

        console.log(cartData);

        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);
        console.log(subtotel, "rrt");
        res.render('checkout', { address, cartData, subtotel });
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
        const deliveryAddressObjectId = new mongoose.Types.ObjectId(selectedAddress);
        console.log(deliveryAddressObjectId, 'jkjk')
        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );
        console.log("lockone", userAddress)

        const selectedpayament = jsonData.payment

        let status = selectedpayament == "Cash on delivery" ? "placed" : "pending"



        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);

        console.log("user", user);
        console.log("cartdata", cartData);
        console.log("body here", req.body);
        console.log("selectedaddress", selectedAddress);
        console.log("payment", selectedpayament);


        const order = new orderSchema({
            user: userId,
            delivery_address: deliveryAddressObjectId,
            payment: selectedpayament,
            products: cartData.products,
            subtotal: subtotel,
            orderStatus: status,
            orderDate: new Date(),
        })
        await order.save();
        // const orderId = order._id;

        if (order.orderStatus === "placed") {
            for (let i = 0; i < cartData.products.length; i++) {
                let product = cartData.products[i].productId;
                let count = cartData.products[i].count;

                console.log(product);
                console.log(count);
                await productSchema.updateOne({ _id: product }, { $inc: { quantity: -count } })
            }



            res.json({ status: 'success', message: "product placed succesfully" });
        }




    } catch (err) {
        console.log(err);
    }
}

const success = async (req, res) => {
    try {
        // const userId = req.session.user_id;
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
    const orderId = req.body.orderId;
    console.log("here ",orderId);

    try {
        const userId = req.session.user_id;
        console.log(userId);


        const orderdata = await orderSchema.findOneAndUpdate({ _id:orderId}, { orderStatus: "canceled" });
        console.log("orderd data",orderdata);



        for (let i = 0; i < orderdata.products.length; i++) {
        
                let product = orderdata.products[i].productId;
                let count = orderdata.products[i].count;

                console.log(orderdata);
                console.log(count);
                await productSchema.updateOne({ _id: product }, { $inc: { quantity: count } })
            

        }
        res.json({ status: "success" });


    } catch (error) {
        console.log(error);
    }

}



module.exports = {
    checkout,
    checkoutPost,
    success,
    orderstatus,
    cancelorder
}