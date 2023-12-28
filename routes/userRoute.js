//  Require modules
const express = require("express");
const userRoute = express();

// Require user Controllers
const userController = require("../controllers/userControllers");
const productController = require('../controllers/productController');


userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')


userRoute.get("/home", (req, res) => {
    res.render('indexhome')
})

userRoute.get("/login", (req, res) => {
    res.render("login");
})

userRoute.get("/otp", (req, res) => {
    req.session.user_id = req.query.id
    res.render("otp");
})

userRoute.post('/otp', userController.verifyPost)


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
userRoute.get("/about", (req, res) => {
    res.render('about')
})


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