const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userOTPverificationSchema = new Schema({

    user_id:{
        type:String,
        required:true
    },
    email:{
        
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now,
        expires:'1m'
    },
    expiresAt:{
        type:Date,
        default:Date.now
    }

});

const Otp = mongoose.model("Otp",userOTPverificationSchema);

module.exports = Otp;