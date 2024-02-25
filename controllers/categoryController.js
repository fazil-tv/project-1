const productSchema = require("../model/productSchema");
const categorySchema = require("../model/categoryModel");
const offerSchema = require("../model/offerModel");



// category
const category = async (req, res) => {
    try {
        const NewCategory = await categorySchema.find({})
        const offer = await offerSchema.find({});
     
        res.render("category", { NewCategory,offer});
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





const addCategoryPost = async (req, res) => {
   
    try {
        const  name= req.body.categoryname;
        const discription = req.body.description;

     
        const nameRegex = new RegExp(`^${name}$`, 'i'); 

        const validData = await categorySchema.findOne({ name: nameRegex });
        if (validData) {

            res.json({status:"failed"})
            // r es.render('addcategory', { message: "this category is already added", })
        } else {
            const NewCategory = new categorySchema({
                name: name,
                discription: discription
            })
            await NewCategory.save();

            res.json({status:"this category is already added"});
            // res.redirect('/admin/category',)
        }
    } catch (error) {
        console.log(error.message)
    }
}


//block category
const blockCategory = async (req, res) => {

    try {
        const categoryId = req.body.categoryId;

       
        await categorySchema.updateOne({ _id: categoryId }, { $set: { is_list: true } })

   
        res.status(200).json({ message: 'category blocked' })
    } catch (error) {
        res.status(500).render('500');
    }
}
//unblock category
const unblockCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
      
        await categorySchema.updateOne({ _id: categoryId }, { $set: { is_list: false } })
        res.status(200).json({ message: "category unblocked" });
    } catch (error) {
        res.status(500).render('500');
    }

}


// edit category
const editcategory = async (req, res) => {

    try {
        const categoryId = req.params.categoryId;
        const editname = req.body.editcategoryname;
        const editcategorydesc = req.body.editcategorydesc;
        

        const nameRegex = new RegExp(`^${editname }$`, 'i'); 

        const existingCategory = await categorySchema.findOne({ name: nameRegex });
        
        if (existingCategory) {
            return res.status(400).json({ status: "failed", message: "Category with the same name already exists." });
        }
        const updatecategory = await categorySchema.findByIdAndUpdate(categoryId, { name: editname, discription: editcategorydesc }, { new: true });
        res.json({ status: "success", updatecategory })

    } catch (error) {
        res.status(500).render('500');
    }
}







module.exports = {
    category,
    addcategory,
    addCategoryPost,
    blockCategory,
    unblockCategory,
    editcategory,
}


