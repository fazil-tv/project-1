const express = require("express");
const adminRoute = express();


adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/user')

// adminRoute.get("/home",(req,res)=>{
//     res.render('indexhome')
// })
// adminRoute.get("/kr",(req,res)=>{
    
// })
module.exports = adminRoute;