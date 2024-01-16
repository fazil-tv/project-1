const isLogin = (req,res,next)=>{
    // try{
    //     if(req.session.user_id){
    //         next()
    //     }
    //     else{
    //         res.redirect('/login');
    //     }

    // }catch(error){
    //     console.log(error);
    //     res.redirect('/login');
    // }
}


const isLogout = (req,res,next)=>{
    // try {
    //     console.log(req.session.user_id,req.session.email)
    //     if(req.session.user_id){
    //         console.log('hi')
    //         res.redirect('/indexhome');

    //     }else{
    //         console.log('hielll')
    //         next();
    //     }

    // } catch (error) {
    //     console.log(error)
    // }
}



module.exports={
    isLogin,
    isLogout
}