const { name } = require("ejs");
const User = require("../model/userSchema");
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const nodemailer = require("nodemailer");
const Otp = require('../model/userOTPverification')
const bcrypt = require("bcrypt");
const productSchema = require("../model/productSchema");
const { log } = require("console");



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
            // Handle the case where the save operation did not return user data
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
        res.redirect(`/otp?id=${id}`);
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
                res.redirect(`/otp?id=${userId}`);
            } else {
                // await User.updateOne({ _id: userId }, { verfied: true });

                await Otp.deleteOne({ user_id: userId });

                //signup verification session

                req.session.user_id = userData._id;
                req.session.email = email;

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

        res.render("indexhome", { user: req.session.user_id });
    } catch (error) {
        console.log(error.message);
    }

}
// shop
const shop = async (req, res) => {
    try {
        const product = await productSchema.find({}).populate('category');
        console.log(product);
        res.render("shop", { product: product });

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
        res.render("singleproduct", { product });
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
        console.log(userId);
        const user = await User.findById(userId);
        console.log(user);
        res.render('useraccount', { user });

    } catch (error) {
        console.log(error);
    }
}


// Verify_Login

const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            const userblock = await User.findOne({ is_blocked: false });
            if (passwordMatch && userblock) {
                req.session.user_id = userData._id;
                req.session.email = email;
                res.redirect('/indexhome');
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
        userData = await User.findById(req.session.user_id);
        console.log(userData);
        const updatedUserData = await User.findOneAndUpdate(

            { email: userData.email },
            {
                $set: {
                    username: req.body.editname,
                    mobilenumber: req.body.editMobile,
                },
            },
            { new: true }
        );

        console.log(updatedUserData.name);
        console.log(updatedUserData.mobile);
        res.redirect('/useraccount')

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
    resetpassword
}
