require('dotenv').config();
const userModal = require('../model/userSchema')
const path = require("path");



// ----------------signup---------
const signup = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}





//admin password verification
const adminverifyLogin = async (req, res) => {

    try {
        const email =process.env.ADMIN_EMAIL;
        const password =process.env.ADMIN_PASSWORD;     
        const useremail = req.body.email;
        const userpassword = req.body.password;
        

        if (email==useremail&&password==userpassword) {
                res.render('index')
        } else {
            const message ="Incorrect username or password";
            res.render('login', { message });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loaddashbord=async(req,res)=>{
    try {
        res.render("index");
    } catch (error) {
        console.log(error);
    }
    
}


const loadUser=async(req,res)=>{
    try {
        const usersData = await userModal.find({})
        console.log(usersData);
        res.render("users",{usersData});
    } catch (error) {
        console.log(error);
    }
    
}


module.exports={
    adminverifyLogin,
    signup,
    loadUser,
    loaddashbord
}