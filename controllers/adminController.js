require('dotenv').config();
const userModal = require('../model/userSchema')


// ----------------signup---------
const signup = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}


// users
const users = async (req, res) => {
    try {
        res.render("users");
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

// loding admin dashbord
const loadUser=async(req,res)=>{
    try {
        const usersData = await userModal.find({})
        console.log(usersData);
        res.render("users",{usersData});
    } catch (error) {
        console.log(error);
    }
    
}



// block user
const blockUser = async (req, res) => {
    
    try {
        const userId = req.body.userId;
        await userModal.updateOne({ _id: userId }, { $set: { is_blocked: true } });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// unblock user
const unblockUser = async (req, res) => {
    try {
        const user = req.body.userId;
        await userModal.updateOne({ _id: user }, { $set: { is_blocked: false } });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports={
    adminverifyLogin,
    signup,
    loadUser,
    users,
    loaddashbord,
    blockUser,
    unblockUser
}