const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobilenumber:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
        type :String,
        required:true
    }

});
const User = mongoose.model("User",userSchema);
module.exports = User;