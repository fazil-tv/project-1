const express = require("express");
const userRoute = express();
const userController = require("../controllers/userControllers");
const sendmailUser = require('../controllers/userControllers');


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

module.exports = userRoute;