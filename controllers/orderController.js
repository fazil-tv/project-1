
const userSchema = require("../model/userSchema");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
const cartSchema = require("../model/cartModel");
const orderSchema = require('../model/orderModel');




const checkout = async (req, res) => {
    try {
        console.log(req.session.user)
        const userId = req.session.user_id;
        console.log(userId);
        const userData = await userSchema.findById(userId);
        console.log(userData);
        const address = await addressSchema.find({ user: userId });
        console.log(address);
        const cartData = await cartSchema.findOne({ user: userId }).populate('products');

        console.log(cartData);

        const subtotel = cartData.products.reduce((acc, val) => acc + (val.totalPrice || 0), 0);
        console.log(subtotel);
        res.render('checkout',{address,cartData,subtotel});
    } catch (error) {
        console.log(error);
    }
}


const checkoutPost = async (req,res)=>{

    try{
       
        console.log("body here",req.body)

        const userId = req.session.user_id;
        const user=await userSchema.findOne({_id:userId})

        let addressObject;
        const selectedAddress = req.body.selectedAddress;
        const paymentMethod = req.body.payment;

        const cartData = await cartSchema.findOne({ user: userId });
        
      let status=paymentMethod=="Cash on delivery"?"placed":"pending"
      const orderItems = [];


      console.log("1",userId)
      console.log("2",user)
      console.log("3",selectedAddress)
      console.log("4",paymentMethod)
      console.log("5",cartData)




    }catch(err){
        console.log(err);
    }
}




module.exports = {
    checkout,
    checkoutPost
}