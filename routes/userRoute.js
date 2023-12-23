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

// //product 
// userRoute.get('/shop',productController.shop);

module.exports = userRoute;