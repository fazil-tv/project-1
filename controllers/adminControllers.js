require('dotenv').config();

const path = require("path");



// const email = process.env.ADMIN_EMAIL;
// const password = process.env.ADMIN_PASSWORD;


// ----------------signup---------
const signup = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}


const adminverifyLogin = async (req, res) => {

    try {
        const email =process.env.ADMIN_EMAIL;
        const password =process.env.ADMIN_PASSWORD;     
        const useremail = req.body.email;
        const userpassword = req.body.password;
        

        if (email==useremail&&password==userpassword) {
                res.send("done");
        } else {
            const message ="Incorrect username or password";
            res.render('login', { message });
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    adminverifyLogin,
    signup
}