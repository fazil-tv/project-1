const { name } = require("ejs");
const User = require("../model/userSchema");
const path = require("path");
require('dotenv').config();
const session = require('express-session');
// const router = express.router();
const nodemailer = require("nodemailer");
const Otp = require('../model/userOTPverification')
const bcrypt = require("bcrypt");



const userOTPverification = require("../model/userOTPverification");



// ----------------signup---------

const signup = async (req, res) => {
    try {
        res.render("signup");
    } catch (error) {
        console.log(error.message);
    }
}

//---------------insert user Data---------

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
        

        // -------password-security(bcrypt)-------

        const hashedpassword = await bcrypt.hash(req.body.password,10);
        const hashedconfirmPassword = await bcrypt.hash(req.body.confirmPassword,10);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            mobilenumber: req.body.mobilenumber,
            password: hashedpassword,
            confirmPassword: hashedconfirmPassword

        });

        // Save the new user

        const userData = await user.save();
        const id=userData._id
        if (userData) {
            // Render the home page if the save operation is successful

            await sendmailUser(email,id,res);
            
        } else {
            // Handle the case where the save operation did not return user data

            return res.render('signup', { message: "Signup failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('signup', { message: "Internal Server Error" });
    }
}


// //  1 nodemailer setup
let transporter = nodemailer.createTransport({
    service:'gmail' ,
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
    }
});


// email sending 
let sendEmails = async (email,_id) => {
    try {
        
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup.</p>
                   <p>This code <b>expires in 1 hour</b>.</p>`,
        };

        // Send the email
        const hashedOTP = await bcrypt.hash(otp,10);

        await transporter.sendMail(mailOptions);
        const newOtp = new Otp({
            user_id:_id,
            email: email,
            otp: hashedOTP,
        });
        await newOtp.save();

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};



const sendmailUser = async (email,id,res) => {
    try {
        await sendEmails(email,id);
        console.log("Email sent successfully");
        console.log(id);
        res.redirect(`/otp?id=${id}`);
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
        console.log("Session ID:", userId);

        const userOTPVerificationrecord = await userOTPverification.find({user_id: userId })
        console.log(userOTPVerificationrecord);

        if (userOTPVerificationrecord.length == 0) {
            res.render('otp', { message: "record doesn't exist or has been verified already" })
        } else {
            const { expiresAt } = userOTPVerificationrecord[0];
            const hashedOTP = userOTPVerificationrecord[0].otp;

            // if (expiresAt < Date.now()) {
            //     await userOTPVerificationrecord.deleteMany({ userId });
            //     res.render('otp', { message: "your otp has been expired" })
            // } else {
                const validOTP = await bcrypt.compare(otp, hashedOTP);
                if (!validOTP) {
                    res.render('otp', { message: "Invalid code" })
                } else {
                    // await User.updateOne({ _id: userId }, { verfied: true });
                    await userOTPverification.deleteOne({ user_id:userId });

                    res.redirect(`/home`)
                }
            }
        
    } catch (error) {
        console.log(error.message);
    }
}


// ----------------login---------

const login = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }

}
// -----Verify_Login-------

const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect('/home');
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







module.exports = {
    signup,
    sendmailUser,
    insertUser,
    verifyPost,
    login,
    verifyLogin,
    sendEmails,
    transporter
}
