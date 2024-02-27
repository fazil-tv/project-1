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
const offerSchema = require('../model/offerModel');
const { id } = require("schema/lib/objecttools");
const categorySchema = require("../model/categoryModel");




const offer = async (req, res) => {
    try {

        const offer = await offerSchema.find({})
        res.render('offer', { offer });
    } catch (error) {
        console.log(error);
    }
}
const addoffer = async (req, res) => {
    try {
        res.render('addoffer');
    } catch (error) {
        console.log(error);
    }
}

const postoffer = async (req, res) => {
    try {

        const offerData = await offerSchema.findOne({ name: req.body.name });
        if (offerData) {

            res.json({ status: false })

        } else {
            const data = new offerSchema({
                name: req.body.offername,
                discountAmount: req.body.offerPercentage,
                activationDate: req.body.ActivateDate,
                expiryDate: req.body.ExpiryDate,

            })
            await data.save()
            res.json({ status: true })
        }


    } catch (error) {
        console.log(error);
    }
}

const deletoffer = async (req, res) => {
    try {
        const offerId = req.body.offerId;

        const offerremoved = await offerSchema.deleteOne({ _id: offerId });
        res.json({ status: true });
    } catch (error) {
        console.log(error);
    }
}


const applyoffer = async (req, res) => {
    try {
      

        const offerID = req.body.offerId
        const Id = req.body.productId
        const offerId= new mongoose.Types.ObjectId(offerID);  

        const product = await productSchema.findOneAndUpdate(
            { _id: Id },
            { $set: {offer: offerId,discountedPrice:0} },
            { new: true }
        );
    
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}


const removeoffer = async (req, res) => {
    try {
    

     
        const Id = req.body.productId
       
        
        const product = await productSchema.findOneAndUpdate(
            { _id: Id },
            { $unset: {offer:1,discountedPrice:1} },
            { new: true }
        );
  
        res.json({ status: true })
    } catch (error) {
        console.log(error);
    }
}

const applycategoryoffer  = async (req,res)=>{

    try {
        const offerId = req.body.offerId;
        const categoryId = req.body.categoryId;

      

        const category = await categorySchema.findOneAndUpdate(
            { _id: categoryId },
            { $set: {offer: offerId } },
            { new: true }
        );
      

        res.json({ status: true })

    } catch (error) {
        console.log(error)
    }

}


const removecategoryoffer  = async (req,res)=>{

    try {
        const categoryId = req.body.categoryId;
 

        const category = await categorySchema.findOneAndUpdate(
            { _id: categoryId },
            { $unset: {offer:1,discountedPrice:1} },
            { new: true }
        );
        
        const product = await productSchema.findOneAndUpdate(
            {  category: categoryId },
            { $unset: {offer:1,discountedPrice:1} },
            { new: true }
        );
   

        res.json({ status: true })

    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    addoffer,
    offer,
    postoffer,
    deletoffer,
    applyoffer,
    removeoffer,
    applycategoryoffer,
    removecategoryoffer
}






