// const { name } = require("ejs");
// const User = require("../model/userSchema");
// const path = require("path");
// require('dotenv').config();
// // const router = express.router();

// // password handler
// const bcrypt = require("bcrypt")

// // email handler
// const nodemailer = require("nodemailer");
// const userOTPverification = require("../model/userOTPverification");
// const util = require('../util/util')


// // ----------------signup---------

// const signup = async (req, res) => {
//     try {
//         res.render("signup");
//     } catch (error) {
//         console.log(error.message);
//     }

//     // password handling
//     // const saltRounds = 10;
//     // bcrypt
//     //     .hash(password, saltRounds)
//     //     .then((hashpassword) => {
//     //         const newUser = new User({
//     //             name,
//     //             email,
//     //             password: hashpassword,
//     //             verified: false,
//     //         })
//     //         newUser
//     //         .save()
//     //         .then((result) => {
//     //             sendOTPverificationEmail(result, res)
//     //         })
//     //     })
// }

// //---------------insert user Data---------

// const insertUser = async (req, res) => {

//     try {
//        console.log(req.body)
//         const { username, email, mobilenumber, password, confirmPassword } = req.body;
//         console.log(username,email,mobilenumber)
//         // Check if the user already exists based on username or email
//         const existingUser = await User.findOne({ $or: [{ username }, { email },{ mobilenumber }] });

//         if (existingUser) {
//             console.log('hi')
//             // User already exists, render the signup page with an error message
//             return res.render('signup', { message: "User already exists" });
//         }
//           // If the user does not exist, proceed to create a new user
//           const user = new User({
//             username: req.body.username,
//             email: req.body.email,
//             mobilenumber: req.body.mobilenumber,
//             password: req.body.password,
//             confirmPassword: req.body.confirmPassword

//         });
//         // Save the new user
//          const userData = await user.save();
//          console.log(userData)
//          if (userData) {
//         // Render the home page if the save operation is successful
//             await sendmailUser(email);
//             console.log('hello');
//             return res.render('otp', { user: userData });
//         } else {
//         // Handle the case where the save operation did not return user data
//         console.log('hi')
//             return res.render('signup', { message: "Signup failed" });
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.render('signup', { message: "Internal Server Error" });
//     }
// }

// // send otp verification email 
// const sendmailUser = async (email) => {

//     try {
//         await util.sendEmails(email);
//         console.log("Email sent successfully");
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.send("Error sending email");
//     }
// };


// module.exports = {
//     signup,
//     sendmailUser,
//     insertUser,
// }




//  util


// require('dotenv').config();
// const nodemailer = require("nodemailer");
// const userOTPverification = require("../model/userOTPverification");
// const sendmailUser = require('../controllers/userControllers');



// // // nodemailer setup
// let transporter = nodemailer.createTransport({
//     service:'gmail' ,
//     auth: {
//         user: process.env.NODE_MAILER_EMAIL,
//         pass: process.env.NODE_MAILER_PASS,
//     }
// });

// let sendEmails = async (email) => {
//     try {
//         const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
//         const mailOptions = {
//             from: process.env.NODE_MAILER_EMAIL,
//             to: email,
//             subject: "Verify Your Email",
//             html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup.</p>
//                    <p>This code <b>expires in 1 hour</b>.</p>`,
//         };

//         // Send the email
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully");
//     } catch (error) {
//         console.error("Error sending email:", error.message);
//         // Handle the error appropriately
//     }
// };


// module.exports={
//     // generateOTP,
//     // main
//     sendEmails
// }

