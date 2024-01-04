//  Require modules
const express = require("express");
const userRoute = express();

// Require user Controllers
const userController = require("../controllers/userControllers");
const productController = require('../controllers/productController');
const User = require("../model/userSchema");


userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')


userRoute.get("/home", (req, res) => {
    res.render('indexhome')
})

userRoute.get("/login", (req, res) => {
    res.render("login");
})


userRoute.get("/otp", async (req, res) => {
    const userId = req.session.user_id = req.query.id
    console.log("kitty:",userId);
    const user = await User.findOne({_id:userId});
    const email = user.email;
    console.log("kitty:",email);
    res.render("otp", { userId ,email});

});
userRoute.post('/otp', userController.verifyPost)


userRoute.post('/resendotp', (req, res) => {
    const { email, userId } = req.body;
    console.log("nooop");
    console.log(userId);
    userController.resendmailUser(userId,res);
});



// SIGN-UP
userRoute.get("/signup", userController.signup);
userRoute.post('/signup', userController.insertUser);



// LOGIN
userRoute.post('/login', userController.verifyLogin);
userRoute.post('/', userController.verifyLogin);


//indexhome
userRoute.get("/indexhome", userController.indexhome);
userRoute.post('/indexhome', userController.indexhome);

//blog
userRoute.get("/blog", userController.blog);
userRoute.post('/blog', userController.blog);



//singleproduct
userRoute.get("/singleproduct", userController.singleproduct);
userRoute.post('/singleproduct', userController.singleproduct);

//shop
userRoute.get("/shop", userController.shop);
userRoute.post('/shop', userController.shop);
//about
userRoute.get("/about", userController.about);
userRoute.post('/about', userController.about);
//useraccount
userRoute.get("/useraccount", userController.useraccount);
// userRoute.post('/about', userController.about);

//resetpassword
userRoute.get(" /resetpassword", userController.resetpassword);
userRoute.post('/resetpassword', userController.resetpassword);


// edit user
userRoute.post('/edituser', userController. edituser)

//contact
userRoute.get("/contact", (req, res) => {
    res.render('contact')
})

//cart
userRoute.get("/cart", (req, res) => {
    res.render('cart')
})

//checkout
userRoute.get("/checkout", (req, res) => {
    res.render('checkout')
})


module.exports = userRoute;