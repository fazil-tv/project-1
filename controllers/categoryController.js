const productSchema = require("../model/productSchema");
const categorySchema = require("../model/categoryModel");



// category
const category = async (req, res) => {
    try {
        const NewCategory = await categorySchema.find({});
        console.log(" NewCategory")
        res.render("category", { NewCategory });
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
        const name = req.body.name;
        const discription = req.body.discription;
        const validData = await categorySchema.findOne({ name: name });
        if (validData) {
            res.render('addcategory', { message: "this category is already added", })
        } else {
            const NewCategory = new categorySchema({
                name: name,
                discription: discription
            })
            await NewCategory.save()
            res.redirect('/admin/category',)
        }
    } catch (error) {
        console.log(error.message)
    }
}


//block category
const blockCategory = async (req, res) => {

    try {
        const categoryId = req.body.categoryId;

        console.log(categoryId);
        await categorySchema.updateOne({ _id: categoryId }, { $set: { is_list: true } })

        console.log(categorySchema);
        res.status(200).json({ message: 'category blocked' })
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}
//unblock category
const unblockCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
        console.log(categoryId);
        await categorySchema.updateOne({ _id: categoryId }, { $set: { is_list: false } })
        res.status(200).json({ message: "category unblocked" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }

}


// edit category
const editcategory = async (req, res) => {
    console.log("hiiiiia")

    try {
        const categoryId = req.params.categoryId;
        const editname = req.body.editcategoryname;
        const editcategorydesc = req.body.editcategorydesc;
        console.log("done", categoryId);
        console.log(editname);
        console.log(editcategorydesc);

        const existingCategory = await categorySchema.findOne({ name: editname});
        if (existingCategory) {
            return res.status(400).json({ status: "error", message: "Category with the same name already exists." });
        }

        const updatecategory = await categorySchema.findByIdAndUpdate(categoryId, { name: editname, discription: editcategorydesc }, { new: true });
        res.json({ status: "success", updatecategory })

    } catch (error) {
        console.log(error);
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


