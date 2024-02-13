const { name } = require("ejs");
const User = require("../model/userSchema");
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const nodemailer = require("nodemailer");
const Otp = require('../model/userOTPverification')
const bcrypt = require("bcrypt");
const productSchema = require("../model/productSchema");
const addressSchema = require("../model/addressModel");
// const categorySchema =require("../controllers/categoryController");
const { log } = require("console");
const categorySchema = require("../model/categoryModel");
const orderSchema = require('../model/orderModel');
const couponSchema = require("../model/couponModel")
const bannerSchema = require("../model/bannerModel");
const wishlistSchema = require("../model/wishlistModel");
const mongoose = require('mongoose');


const puppeteer = require('puppeteer')
const ejs = require("ejs");
const puppeteerpdf = require("pdf-puppeteer");
const cartSchema = require("../model/cartModel");



// signup

const signup = async (req, res) => {
    try {
        res.render("signup");
    } catch (error) {
        console.log(error.message);
    }
}





//insert user Data
const insertUser = async (req, res) => {
    try {
        const { username, email, mobilenumber, password, confirmPassword } = req.body;
        // Check if the user already exists based on username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { mobilenumber }] });

        if (existingUser) {
            // User already exists
            const message = "User already exists"
            return res.render('signup', { message });

        }


        // password-security(bcrypt)

        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        const hashedconfirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            mobilenumber: req.body.mobilenumber,
            password: hashedpassword,
            confirmPassword: hashedconfirmPassword

        });

        // Save the new user
        const userData = await user.save();
        req.session.user_id = userData._id;
        const id = userData._id
        if (userData) {

            await sendmailUser(email, id, res);

        } else {
            return res.render('signup', { message: "Signup failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('signup', { message: "Internal Server Error" });
    }
}


//  nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
    }
});


// email sending 
let sendEmails = async (email, _id) => {
    try {

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup.</p>
                   <p>This code <b>expires in 5 minits</b>.</p>`,
        };

        // Send the email
        const hashedOTP = await bcrypt.hash(otp, 10);

        await transporter.sendMail(mailOptions);
        const newOtp = new Otp({
            user_id: _id,
            email: email,
            otp: hashedOTP,
        });
        await newOtp.save();

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};


const sendmailUser = async (email, id, res) => {
    try {
        await sendEmails(email, id);
        console.log(id);
        console.log("Email sent successfully");
        res.redirect(`/otp`);
    } catch (error) {
        console.error("Error sending email:", error);
        res.send("Error sending email");
    }
};




//resend otp
const resendEmails = async (email, _id) => {
    try {
        console.log("sdsdsdhg")
        console.log(email);

        // Generate a new OTP
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: email,
            subject: "Resend OTP - Verify Your Email",
            html: `<p>Your new OTP is <b>${otp}</b>. Enter it in the app to verify your email address.</p>
                   <p>This code <b>expires in 3 minutes</b>.</p>`,
        };
        const hashedOTP = await bcrypt.hash(otp, 10);

        await transporter.sendMail(mailOptions);

        // Update the OTP in the database
        await Otp.findOneAndUpdate({ user_id: _id, email: email }, { otp: hashedOTP });

        console.log("Email resent successfully");
    } catch (error) {
        console.error("Error resending email:", error.message);
    }
};

const resendmailUser = async (userId, res) => {

    try {
        console.log("hiiiii");
        console.log(userId);
        const user = await User.findOne({ _id: userId });
        console.log(user);
        const email = user.email;
        console.log("email", email);
        await resendEmails(email, userId);

        console.log("last user", userId)
        console.log(" resent otp successfully");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.send("Error sending email");
    }
};



//otp verification 
const verifyPost = async (req, res) => {
    try {
        const { num1, num2, num3, num4 } = req.body;
        const otp = `${num1}${num2}${num3}${num4}`;


        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        const email = user.email;

        console.log("1st email", email);

        console.log("Session ID:", userId);

        const userOTPVerificationrecord = await Otp.find({ user_id: userId })
        console.log(userOTPVerificationrecord);

        if (userOTPVerificationrecord.length == 0) {
            res.render('otp', { message: "record doesn't exist or has been verified already" })
        } else {
            // const { expiresAt } = userOTPVerificationrecord[0];
            const hashedOTP = userOTPVerificationrecord[0].otp;


            const validOTP = await bcrypt.compare(otp, hashedOTP);

            if (!validOTP) {
                console.log("invalid otp");
                // res.render('otp',{message:'invalid otp',userId});
                console.log("this", email);
                console.log("this", userId);
                // const email = userId.email;
                res.render('otp', { message: 'invalid otp', userId, email });
            } else {

                await Otp.deleteOne({ user_id: userId });
                console.log("ok da kitty")
                res.redirect(`/indexhome`);

            }
        }

    } catch (error) {
        console.log(error.message);
    }
}


// login

const login = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }

}
// blog
const blog = async (req, res) => {
    try {
        res.render("blog");
    } catch (error) {
        console.log(error.message);
    }

}
// indexhome
const indexhome = async (req, res) => {
    try {
        const product = await productSchema.find({}).populate('category')

        const bannerData = await bannerSchema.find({});

        const Wishlist = await wishlistSchema.findOne({ user: req.session.user_id });

        const categoryData = await categorySchema.find({});
        console.log(product, "productssssss");
        console.log(Wishlist, 'kdfksdfk')


        console.log(Wishlist, "^^^^^^okkk")



        res.render("indexhome", { user: req.session.user_id, product: product, bannerData, Wishlist, categoryData });
    } catch (error) {
        console.log(error.message);
    }

}

// logout
const userLogout = async (req, res) => {
    console.log("jkl")
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err.message);
            } else {
                console.log("Session destroyed");

                res.redirect('/signup');
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

// shop
const shop = async (req, res) => {
    try {
        const category = await categorySchema.find({});
        console.log(category)

        const Wishlist = await wishlistSchema.findOne({ user: req.session.user_id });
        const searchQuery = req.query.search || "";
        const page = req.query.page ? req.query.page : 1;
        const prevPage = page - 1;
        const totalDoc = await productSchema.countDocuments();
        const product = await productSchema.find({}).populate('category').skip(prevPage * 4).limit(6)



        console.log(totalDoc);
        res.render("shop", { product: product, category: category, searchQuery, page, totalDoc, Wishlist });

        // const category = await categorySchema.find({}).sort({ name: 1 })
        // console.log(category)

        // const searchQuery = req.query.search || "";
        // const page = req.query.page ? req.query.page : 1;
        // const totalDoc = await productSchema.countDocuments();
        // const prevPage = page - 1;

        // const product = await productSchema.find({}).populate('category').
        //     res.render("shop", { product: product, category: category, searchQuery }).skip(prevPage * 4).limit(4)



    } catch (error) {
        console.log(error.message);
    }

}
// product-single
const singleproduct = async (req, res) => {
    try {
        const productId = req.query.id;
        console.log(productId);
        const product = await productSchema.findOne({ _id: productId }).populate('category');
        console.log(product);

        const cartdata = await cartSchema.findOne({user: req.session.user_id})
        console.log(cartdata)
        
        res.render("singleproduct", { product, user: req.session.user_id, cartdata });
    } catch (error) {
        console.log(error.message);
    }

}
//about
const about = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.log(error);
    }
}
//user account
const useraccount = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const useraddress = await addressSchema.findOne({ user: userId });
        const orders = await orderSchema.find({ user: userId })
        // const invoice = await orderSchema.findByIdAndUpdate({ user: userId },{});
        const result = await orderSchema.updateMany(
            {
                user: userId,
                $or: [
                    { "products.productstatus": 'Delivered' },
                    { "products.productstatus": 'return' }
                ]
            },
            {
                $set: { invoice: true }
            }
        );




        console.log(invoice, "orders,$$$$$$$$$$$$$$$$$$$$")


        const user = await User.findById(userId);

        res.render('useraccount', { user, useraddress, orders, invoice });

    } catch (error) {
        console.log(error);
    }
}



// Verify_Login

const verifyLogin = async (req, res) => {

    try {
        console.log('verify')
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            const userblock = await User.findOne({ is_blocked: false });
            if (passwordMatch && userblock) {
                req.session.user_id = userData._id;
                req.session.email = email;
                res.redirect('/');
                console.log(req.session.user_id)
            } else {
                res.render('login', { message: "Incorrect username or password", type: "error" });
            }
        } else {

            res.render('login', { message: "Incorrect username or password" });
        }
    } catch (error) {
        console.log(error.message);
    }
}


// user edit

const edituser = async (req, res) => {
    try {
        console.log("heee")
        userData = await User.findById(req.session.user_id);
        console.log(userData);

        const fullname = req.body.fullname;
        const mobile = req.body.mobile;

        console.log(fullname);
        console.log(mobile);
        const updatedUserData = await User.findOneAndUpdate(

            { email: userData.email },
            {
                $set: {
                    username: fullname,
                    mobilenumber: mobile
                },
            },
            { new: true }
        );

        console.log(updatedUserData.fullname);
        console.log(updatedUserData.mobile);

        res.json({ success: true });
        // res.redirect('/useraccount')

    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating user information')

    }
}


// securePassword

// const securePassword = async (password) => {
//     try {

//         return securePass;
//     } catch (error) {
//         console.log(error.message)
//     }
// }

const resetpassword = async (req, res) => {
    try {
        const { newpassword, currentpassword, repeatpassword } = req.body;
        console.log("am here");

        console.log(currentpassword);
        console.log(repeatpassword);
        console.log(newpassword);


        if (newpassword == repeatpassword) {

            userData = await User.findById(req.session.user_id);
            console.log(userData);
            const passwordMatch = await bcrypt.compare(currentpassword, userData.password);
            console.log(passwordMatch);
            const email = userData.email;
            console.log(email)

            if (!passwordMatch) {
                return res.json({ reseted: false });
            }
            else {
                // const hashedPassword = await securePassword(Password)
                const hashedPassword = await bcrypt.hash(newpassword, 10);
                const hashedconfirmPassword = await bcrypt.hash(repeatpassword, 10);
                console.log(hashedPassword);
                await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword, confirmPassword: hashedconfirmPassword } });
            }
        }
        else {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        res.json({ reseted: true });

    } catch (error) {
        console.log(error);
    }



}










// forget password
const forgotpassword = async (req, res) => {
    try {
        res.render("forgotpassword");
    } catch (error) {
        console.error("Error in forgotpassword:", error.message);
        res.status(500).send("Internal Server Error");
    }
}

const forgototp = async (req, res) => {
    try {


        res.render("forgototp");
    } catch (error) {
        console.error("Error in forgototp:", error.message);
        res.status(500).send("Internal Server Error");
    }
}




const getemail = async (req, res) => {
    console.log("hi");
    try {
        req.session.forget_email = req.body.email;
        console.log(req.body.email);
        console.log("kkki");

        const userData = await User.findOne({ email: req.body.email });
        console.log(userData);

        console.log("ioio");
        const userId = userData._id;
        const email = userData.email;
        req.session.user_id = userId;



        console.log(userId);
        console.log(email);

        if (userData) {

            await verifysendmail(email, userId, res);
            const mail = req.body.email;
            const userData = await User.findOne({ email: mail });
            const usrid = userData._id;

            console.log(usrid)

            res.render('forgototp', { usrid, mail });
        } else {
            res.render('getemail', { error: 'Email not found' });
        }
    } catch (error) {
        // console.error("Error in getemail:", error.message);
        // res.status(500).send("Internal Server Error");
        // res.render("getemail");
        res.render('forgotpassword', { message: 'No users found' });
    }
}


const verifysendEmails = async (email, _id) => {
    try {

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup.</p>
                   <p>This code <b>expires in 5 minits</b>.</p>`,
        };

        // Send the email
        const hashedOTP = await bcrypt.hash(otp, 10);

        await transporter.sendMail(mailOptions);
        const newOtp = new Otp({
            user_id: _id,
            email: email,
            otp: hashedOTP,
        });
        await newOtp.save();

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};


const verifysendmail = async (email, id, res) => {
    try {
        await sendEmails(email, id);
        console.log(id);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.send("Error sending email");
    }

}

const otpverification = async (req, res) => {

    try {
        console.log("meow");
        console.log("jkl");
        const { num1, num2, num3, num4 } = req.body;
        const otp = `${num1}${num2}${num3}${num4}`;
        console.log(otp, "otp");



        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        const email = user.email;



        console.log(userId);
        console.log(user);
        console.log(email);
        req.session.email_id = email;

        const userOTPVerificationrecord = await Otp.find({ user_id: userId })
        console.log(userOTPVerificationrecord);


        const hashedOTP = userOTPVerificationrecord[0].otp;
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        console.log(validOTP);
        console.log(hashedOTP);

        if (!validOTP) {
            console.log("invalid otp");
            console.log("this", email);
            console.log("this", userId);

            return res.json({ success: false, message: 'invalid otp' });


            // res.render('forgototp', { message: 'invalid otp', userId, email });
        } else {
            console.log("hmmmmm")
            if (req.session.user_id) {
                // res.render('changepasswordform')
                return res.json({ success: true, message: 'done' });
            } else {
                const userId = req.session.user_id;
                const user = await User.findOne({ _id: userId });
                if (user) {
                    // res.render('changepasswordform');
                    return res.json({ success: true, message: 'done' });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }


}


const changepasswordform = async (req, res) => {
    try {
        res.render("changepasswordform");
    } catch (error) {
        console.error("changepasswordform:", error.message);
        res.status(500).send("Internal Server Error");
    }
}



const changepassword = async (req, res) => {
    try {
        console.log("hrhr")
        if (req.session.user_id) {
            const userId = req.session.user_id;
            console.log(userId);
            const sPassword = await bcrypt.hash(req.body.newpassword, 10);
            await User.findOneAndUpdate({ _id: userId }, { $set: { password: sPassword } })

            res.render("login", { messages: "please enter your new password" })

        } else {
            const sPassword = await bcrypt.hash(req.body.newpassword, 10);
            await User.findOneAndUpdate({ email: req.session.email_id }, { $set: { password: sPassword } })
            res.render('login', { messages: "please enter your new password" });
        }


    } catch (error) {
        console.log(error)
    }



}


const invoice = async (req, res) => {
    try {

        const id = req.query.id;
        const totelorders = await orderSchema.findOne({ _id: id }).populate('products.productId');

        const orders = totelorders.products.filter((val) => val.productstatus === 'Delivered');

        console.log("orders", orders)
        console.log("totelorders", totelorders)

        const deliveryAddressObjectId = new mongoose.Types.ObjectId(totelorders.delivery_address);
        console.log(deliveryAddressObjectId, 'jkjk')
        const userAddress = await addressSchema.findOne(
            { 'address._id': deliveryAddressObjectId },
            { 'address.$': 1 }
        );


        const ejsPagePath = path.join(__dirname, '../views/user/pdf.ejs');
        const ejsPage = await ejs.renderFile(ejsPagePath, { orders, userAddress, totelorders });

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(ejsPage);
        const pdfBuffer = await page.pdf();
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.log(error);
    }
}

// const erros404 = async(req,res)=> {
//     try {
//         res.render("404");

//     } catch (error) {

//     }
// }






module.exports = {
    signup,
    sendmailUser,
    insertUser,
    verifyPost,
    login,
    verifyLogin,
    sendEmails,
    blog,
    indexhome,
    shop,
    about,
    resetpassword,
    singleproduct,
    resendmailUser,
    resendEmails,
    useraccount,
    edituser,
    resetpassword,
    forgotpassword,
    forgototp,
    getemail,
    verifysendEmails,
    verifysendmail,
    otpverification,
    changepasswordform,
    changepassword,
    userLogout,
    invoice,

}
