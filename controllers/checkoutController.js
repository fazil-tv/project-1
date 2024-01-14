const checkout = async (req,res)=>{
    try{
        res.render('checkout');
    }catch(error){
        console.log(error);
    }
}


module.exports={
    checkout
}