//  Require modules
const express = require("express");
const userRoute = express();

// Require user Controllers
const userController = require("../controllers/userControllers");
const productController = require('../controllers/productController');


userRoute.set('view engine','ejs')
userRoute.set('views','./views/user')


userRoute.get("/home",(req,res)=>{
    res.render('indexhome')
})

userRoute.get("/login",(req,res)=>{
    res.render("login");
})
userRoute.get("/otp",(req,res)=>{
    req.session.user_id=req.query.id
    res.render("otp");
})
userRoute.post('/otp',userController.verifyPost)


// SIGN-UP
userRoute.get("/signup",userController.signup);
userRoute.post('/signup',userController.insertUser);


// LOGIN
userRoute.post('/login',userController.verifyLogin);
userRoute.post('/',userController.verifyLogin);



//shop
userRoute.get("/shop",(req,res)=>{
    res.render('shop')
})
//single prduct
userRoute.get("/singleproduct",(req,res)=>{
    res.render('product')
})
//about
userRoute.get("/about",(req,res)=>{
    res.render('about')
})
//blog
userRoute.get("/blog",(req,res)=>{
    res.render('blog')
})
//contact
userRoute.get("/contact",(req,res)=>{
    res.render('contact')
})
//cart
userRoute.get("/cart",(req,res)=>{
    res.render('cart')
})
//checkout
userRoute.get("/checkout",(req,res)=>{
    res.render('checkout')
})

module.exports = userRoute;