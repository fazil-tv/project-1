const User = require('../model/userSchema')


const productSchema = require('../model/productSchema')

const addressSchema = require('../model/addressModel');

// add address
const adaddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const data = {
            fullname: req.body.fullname,
            mobile: req.body.mobile,
            email: req.body.email,
            houseName: req.body.houseName,
            state: req.body.state,
            city: req.body.city,
            pin: req.body.pin
        }
        console.log(data);
        console.log(userId);

        
        await addressSchema.findOneAndUpdate(
            { user: userId },
            {
                $set: { user: userId },
                $push: { address: data }
            },
            { upsert: true, new: true },
        )
        res.json({ add: true })


    } catch (error) {
        console.log(error)
    }

}


// const addressData = await address.save();
const postaddress = async (req, res) => {
    try {



    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    adaddress

}