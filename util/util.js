// require('dotenv').config();
// const nodemailer = require("nodemailer");
// const sendmailUser = require('../controllers/userControllers');
// const Otp = require('../model/userOTPverification')
// const bcrypt = require("bcrypt");



// // nodemailer setup
// let transporter = nodemailer.createTransport({
//     service:'gmail' ,
//     auth: {
//         user: process.env.NODE_MAILER_EMAIL,
//         pass: process.env.NODE_MAILER_PASS,
//     }
// });


// let sendEmails = async (email,_id) => {
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
//         const hashedOTP = await bcrypt.hash(otp,10);

//         await transporter.sendMail(mailOptions);
//         const newOtp = new Otp({
//             user_id:_id,
//             email: email,
//             otp: hashedOTP,
//         });
//         await newOtp.save();

//         console.log("Email sent successfully");
//     } catch (error) {
//         console.error("Error sending email:", error.message);
//     }
// };







// module.exports={
//     sendEmails,
//     transporter
// }

