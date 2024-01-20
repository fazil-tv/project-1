 const User = require('../model/userSchema');

 
 
  
  
  
  const isLogin = (req, res, next) => {
    try {

        if (req.session.user_id) {
            next()
        }
        else {
            res.redirect('/login');
        }

    } catch (error) {
        console.log(error);
    }
}


const isLogout = (req, res, next) => {
    try {
        // console.log(req.session.user_id, req.session.email)
        if (req.session.user_id) {
            console.log('hi')
            res.redirect('/indexhome');

        } else {
            console.log('hielll')
            next();
        }

    } catch (error) {
        console.log(error)
    }
}






const adminblock = async (req,res,next) => {
   
    
    try {

        const user_id = req.session.user_id;
        const user = await User.findOne({_id:user_id});
        


        if (!user) {
            next();
        }else{
            if(user.is_blocked){
                res.redirect('/login');
            }

        }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    isLogin,
    isLogout,
    adminblock
}