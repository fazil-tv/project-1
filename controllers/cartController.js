const User = require("../model/userSchema");
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const nodemailer = require("nodemailer");
const Otp = require('../model/userOTPverification')
const bcrypt = require("bcrypt");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel")
const { log } = require("console");




const cart =  async (req,res)=>{
    res.render('cart');
}


module.exports={
    cart
}