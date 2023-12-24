const productSchema = require("../model/productSchema");
const categorySchema = require("../model/categoryModel");



// category
const category = async (req, res) => {
    try {
        const NewCategory = await categorySchema.find({});
        console.log(" NewCategory")
        res.render("category",{NewCategory});
    } catch (error) {
        console.log(error.message);
    }
}
// addcategory
const addcategory = async (req, res) => {
    try {
        res.render("addcategory");
    } catch (error) {
        console.log(error.message);
    }
}


const addCategoryPost = async (req,res)=>{
    try{
        const name =req.body.name;
        const discription = req.body.discription;
        const validData = await categorySchema.findOne({name:name});
        if(validData){
            res.render('addcategory',{message:"this category is already added", })
        }else{
            const NewCategory = new categorySchema({
                name:name,
                discription:discription
            })
            await NewCategory.save()
            res.redirect('/admin/category',)
        }
    }catch(error){
        console.log(error.message )
    }
} 



module.exports={
    category,
    addcategory,
    addCategoryPost,
}


