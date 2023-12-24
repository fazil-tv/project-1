const mongoose = require("mongoose");


const category= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        uniqe:true
    },
    discription:{
        type:String,
        require:true
    },
    is_list:{
        type:Boolean,
        default:false
    },
});

const categorySchema = mongoose.model("category",category);
module.exports=categorySchema


