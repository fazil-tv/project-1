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

        // const userData = await User.findOne({ email: email });
        
        const useremail = req.body.email;
        const userpassword = req.body.password;
        

        if (email==useremail&&password==userpassword) {
                res.send("done");
        } else {
            res.render('login', { message: "Incorrect username or password" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    adminverifyLogin,
    signup
}