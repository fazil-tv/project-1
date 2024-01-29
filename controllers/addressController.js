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




// edit address

const editaddress = async (req, res) => {

    try {    
        const {fullname, email, state, pin, mobile, city, housename, addressId } = req.body;
        const userId = req.session.user_id;
        console.log(userId);
        console.log("editaddressID",addressId);
        console.log("editfullname",fullname);

        await addressSchema.updateOne({user:userId,'address._id':addressId},{
            $set:{
                'address.$.fullname':fullname,
                'address.$.email':email,
                'address.$.mobile':mobile,
                'address.$.state':state,
                'address.$.pin':pin,
                'address.$.city':city,
                'address.$.houseName': housename,
            }
        })
        res.json({status:"editaddress success",editaddress})
    } catch (error) {
        console.log(error);

    }

}

const deletaddress = async (req,res)=>{
    console.log("ok ok brooo");
    try {
        const userId = req.session.user_id;
        const addressId= req.body.addressId;

        console.log("where",userId);
        console.log("where adderssId",addressId);
        await addressSchema.updateOne({user:userId},{$pull:{address:{_id:addressId}}})
        res.json({add:true});

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    adaddress,
    editaddress,
    deletaddress


}