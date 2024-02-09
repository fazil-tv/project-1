const userSchema = require("../model/userSchema");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
const cartSchema = require("../model/cartModel");
const orderSchema = require('../model/orderModel');
const couponSchema = require('../model/couponModel');
const { json } = require("express");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Razorpay = require('razorpay');
const { config } = require("dotenv");
require('dotenv').config();
const crypto = require("crypto");


const coupon = async (req, res) => {
    try {
        const coupon = await couponSchema.find({})
        res.render('coupon', { coupon });
    } catch (error) {
        console.log(error);
    }
}

const addcoupon = async (req, res) => {
    try {

        // const coupondata = await couponSchema.findOne({couponCode:req.body.couponCode})
        res.render('addcoupon');
    } catch (error) {
        console.log(error);
    }
}
const addcouponpost = async (req, res) => {
    try {
        console.log(req.body);
        // const couponname = req.body.couponname;
        // const couponCode = req.body.couponCode;
        // const DiscountPercentage = req.body.DiscountPercentage;
        // const MaxDiscount = req.body.MaxDiscount;
        // const ActivateDate = req.body.ActivateDate;
        // const ExpiryDate = req.body.ExpiryDate;
        // const CriteriaAmount = req.body.CriteriaAmount;
        const couponData = await couponSchema.findOne({ couponCode: req.body.couponCode });



        if (couponData) {
            // res.render("addcoupon", { message: 'coupon code already exist' })
            res.json({ status: false })

        } else {
            const data = new couponSchema({
                name: req.body.couponname,
                couponCode: req.body.couponCode,
                discountPercentage: req.body.DiscountPercentage,
                activationDate: req.body.ActivateDate,
                expiryDate: req.body.ExpiryDate,
                criteriaValue: req.body.CriteriaAmount
            })
            await data.save()
            res.json({ status: true })
        }

    } catch (error) {
        console.log(error);
    }
}

const deletcoupon = async (req, res) => {
    try {
        const couponId = req.body.couponId;
        console.log(couponId);
        const couponremoved = await couponSchema.deleteOne({ _id: couponId });
        res.json({ status: true });
    } catch (error) {
        console.log(error);
    }
}


const applycoupon = async (req, res) => {
    try {
        const couponId = req.body.couponId
        const userId = req.session.user_id;
        console.log(couponId)
        console.log(userId)

        const currentDate = new Date();
        const couponDatas = await couponSchema.findOne({ _id: couponId, expiryDate: { $gte: currentDate }, is_blocked: false });
        console.log(couponDatas);
        const couponexists = couponDatas.usedUsers.includes(userId);

        if (!couponexists) {

            const existingCart = await cartSchema.findOne({ user: userId });



            if (existingCart && existingCart.couponDiscount == null) {
                await couponSchema.findOneAndUpdate({ _id: couponId }, { $push: { usedUsers: userId } });
                await cartSchema.findOneAndUpdate({ user: userId }, { $set: { couponDiscount: couponDatas._id } });
                res.json({ status: "applid" });
            }else{
                res.json({ status:"alreadyapplid" });
            }
            
        } else {
            res.json({ status:"alreadyused" });
        }


    } catch (error) {
        console.log(error);
    }
}

const removecoupon = async (req, res) => {
    try {

        const couponId = req.body.couponId
        const userId = req.session.user_id;

        console.log(couponId, "kkkkkk")
        console.log(userId);
        const couponData = await couponSchema.findOneAndUpdate({ _id: couponId }, { $pull: { usedUsers: userId } });
        const cartData = await cartSchema.findOneAndUpdate({ user: userId }, { $set: { couponDiscount: null } });
        res.json({ status: true })
    } catch (error) {

        res.json({ status:"alreadyused"})
        console.log(error);
    }

}

module.exports = {
    coupon,
    addcoupon,
    addcouponpost,
    deletcoupon,
    applycoupon,
    removecoupon 
}



