const productSchema = require("../model/productSchema");
const userSchema = require("../model/userSchema");
const categorySchema = require("../model/categoryModel");

const path = require("path")


const multer = require("multer")
const sharp = require('sharp');
const { id } = require("schema/lib/objecttools");




// product
const Product = async (req, res) => {
    try {
        const users = await productSchema.find({}).populate('category');
        console.log(users);
        res.render("product", { product: users });
    } catch (error) {
        console.log(error.message);
    }
}

// addproduct
const addproduct = async (req, res) => {

    const datas = await categorySchema.find({})

    // Render the addproductand  view and pass the categorys data
    const categorys = await categorySchema.find({});
    try {
        res.render("addproduct", { datas, categorys });
    } catch (error) {
        console.log(error.message);
    }
}



//product post
const addProductspost = async (req, res) => {

    try {
        const requestData = req.body;
        console.log(requestData);
        const uploadedFiles = req.files;
        console.log("check:", uploadedFiles);

        const img = [
            uploadedFiles && uploadedFiles.image1 ? uploadedFiles.image1[0].filename : null,
            uploadedFiles && uploadedFiles.image2 ? uploadedFiles.image2[0].filename : null,
            uploadedFiles && uploadedFiles.image3 ? uploadedFiles.image3[0].filename : null,
            uploadedFiles && uploadedFiles.image4 ? uploadedFiles.image4[0].filename : null,
        ];

        for (let i = 0; i < img.length; i++) {
            if (img[i]) {
                await sharp('public/multerimg/' + img[i])
                    .resize(500, 500)
                    .toFile('public/sharpimg/' + img[i])
            }
        }
        if (requestData.quantity > 0 && requestData.price > 0) {
            console.log("ok");
            const product = new productSchema({
                name: requestData.title,
                quantity: requestData.quantity,
                category: requestData.category,
                price: requestData.price,
                offer: requestData.offer,
                description: requestData.description,
                "images.image1": uploadedFiles.image1[0].filename,
                "images.image2": uploadedFiles.image2[0].filename,
                "images.image3": uploadedFiles.image3[0].filename,
                "images.image4": uploadedFiles.image4[0].filename,
            })

            await product.save()
            console.log(product);
            res.redirect('/admin/product');
        }
    } catch (error) {
        console.log(error.message)
    }
}

//block product
const blockProduct = async (req, res) => {
    console.log("kkkk")

    try {
        const productId = req.params.id;
        console.log(productId);
        const productvalue = await productSchema.findOne({ _id: productId });
        console.log(productvalue)

        if (productvalue) {
            if (productvalue.is_blocked) {
                await productSchema.updateOne({ _id: productId }, { $set: { is_blocked: false } });
                res.status(200).json({ message: "Product unblocked successfully" });
            } else {
                await productSchema.updateOne({ _id: productId }, { $set: { is_blocked: true } });
                res.status(200).json({ message: "Product blocked successfully" });

            }
        } else {
            res.status(404).json({ message: "Product not found" });
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


//edit product
// const editproduct = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const product = await productSchema.find({}).populate('category');
//         const categorys = await categorySchema.find({});
//         console.log(categorys );
//         // console.log("dfsd",product);
//         // console.log(categorys);

//         res.render("editproduct", { product,categorys })
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const editProduct = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id)
        const product = await productSchema.findById(id)
        const categorys = await categorySchema.find({});
        res.render("editproduct", { product, categorys, id });
    } catch (error) {
        console.log(error.message);
    }
};


//product post
const editProductpost = async (req, res) => {
    try {
        console.log("kkkkk");
        const id = req.query.id;
        console.log("kitty", id);
        const uploadedFiles = req.files;
        const requestData = req.body;
        const existingData = await productSchema.findOne({ _id: id })
        const img = [
            uploadedFiles?.image1 ? (uploadedFiles.image1[0]?.filename || existingData.images.image1) : existingData.images.image1,
            uploadedFiles?.image2 ? (uploadedFiles.image2[0]?.filename || existingData.images.image2) : existingData.images.image2,
            uploadedFiles?.image3 ? (uploadedFiles.image3[0]?.filename || existingData.images.image3) : existingData.images.image3,
            uploadedFiles?.image4 ? (uploadedFiles.image4[0]?.filename || existingData.images.image4) : existingData.images.image4,
        ];
        console.log(img);

        for (let i = 0; i < img.length; i++) {
            if (img[i]) {
                await sharp(`public/multerimg/${img[i]}`)
                    .resize(500, 500)
                    .toFile(`public/sharpimg/${img[i]}`);
            }
        }


        if (requestData.quantity > 0 && requestData.price > 0) {
            console.log("ok");
            const product = {

                name: requestData.title,
                quantity: requestData.quantity,
                category: requestData.category,
                price: requestData.price,
                offer: requestData.offer,
                description: requestData.description,
                images: {
                    image1: img[0],
                    image2: img[1],
                    image3: img[2],
                    image4: img[3],
                },
            }
            console.log("io io io io");
            const risult = await productSchema.findOneAndUpdate({ _id: id }, product, { new: true });
            risult.save();
            console.log("done")
            res.redirect('/admin/product');
        }
    } catch (error) {
        console.log(error);
    }
}


const productsearching = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const searchQuery = req.query.search || "";
        const categoryData = await categorySchema.find({});
        const totalDoc = await productSchema.countDocuments();
        const category = req.query.category;
        const page = req.query.page ? req.query.page : 1;
        const prevPage = page - 1;


        console.log(searchQuery);
        const productData = await productSchema.find({
            name: { $regex: searchQuery, $options: 'i' },
        }).skip(prevPage * 4).limit(6);

        if (productData) {
            res.render('shop', { product: productData, category: categoryData, userId, searchQuery, totalDoc, page, prevPage })


        }else{
            const message = "product not find";
            res.render('shop', { product: productData, category: categoryData, userId, searchQuery, totalDoc, page, prevPage,message});
            
        }




    } catch (error) {
        console.log(error);

    }
}




const productfilter = async (req, res) => {

    try {
        const userId = req.session.user_id;
        const fromprice = req.query.fromprice;
        const toprice = req.query.toprice;
        const category = req.query.category;
        const sort = parseInt(req.query.sort);
        const searchQuery = req.query.search || "";
        const page = req.query.page ? req.query.page : 1;
        const prevPage = page - 1;
        console.log(searchQuery)
        const categoryData = await categorySchema.find({});
        const totalDoc = await productSchema.countDocuments();

        console.log(sort);
        console.log(fromprice);
        console.log(toprice);
        console.log(userId);
        console.log(category);

        if (category == "all") {
            console.log(searchQuery);
            const productData = await productSchema.find({

                name: { $regex: searchQuery, $options: 'i' },
                price: { $gte: fromprice, $lte: toprice }
            }).sort({ price: sort === 0 ? 1 : -1 }).skip(prevPage * 4).limit(6);

            res.render('shop', { product: productData, category: categoryData, userId, totalDoc, searchQuery, page, prevPage })

        } else {
            console.log("me ");
            const productData = await productSchema.find({
                name: { $regex: searchQuery, $options: 'i' },
                price: { $gte: fromprice, $lte: toprice },
                category: category
            }).sort({ price: sort === 0 ? 1 : -1 }).skip(prevPage * 4).limit(6);
            console.log(productData)

            res.render('shop', { product: productData, category: categoryData, userId, totalDoc,searchQuery, page, prevPage })
        }


    } catch (error) {
        console.log(error);
    }

}








module.exports = {
    Product,
    addproduct,
    addProductspost,
    blockProduct,
    editProduct,
    editProductpost,
    productfilter,
    productsearching
}