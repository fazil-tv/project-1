const productSchema = require("../model/productSchema");
const userSchema = require("../model/userSchema");
const categorySchema = require("../model/categoryModel");
const wishlistSchema = require("../model/wishlistModel");
const offerSchema = require('../model/offerModel');

const path = require("path")
const multer = require("multer")
const sharp = require('sharp');
const { id } = require("schema/lib/objecttools");


// product
const Product = async (req, res) => {
    try {

        const product = await productSchema.find({}).populate('offer').populate({
            path: 'category', populate: {
                path: 'offer'
            }
        });

        const offer = await offerSchema.find({});

        product.forEach(async (product) => {
        

            if (product.category.offer) {
            
                const discountedPrice = product.price * (1 - product.category.offer.discountAmount / 100);

                product.discountedPrice = parseInt(discountedPrice);
                product.offer = product.category.offer
                await product.save();

            } else if (product.offer) {
                const discountedPrice = product.price * (1 - product.offer.discountAmount / 100);
                product.discountedPrice = parseInt(discountedPrice);
                await product.save();


            }
        })

        res.render("product", { product: product, offer });
    } catch (error) {
        console.log(error.message);
    }
}

// addproduct
const addproduct = async (req, res) => {

    const datas = await categorySchema.find({})

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
        const uploadedFiles = req.files;

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
           
            const product = new productSchema({
                name: requestData.title,
                quantity: requestData.quantity,
                category: requestData.category,
                price: requestData.price,
                description: requestData.description,
                "images.image1": uploadedFiles.image1[0].filename,
                "images.image2": uploadedFiles.image2[0].filename,
                "images.image3": uploadedFiles.image3[0].filename,
                "images.image4": uploadedFiles.image4[0].filename,
            })

            await product.save()
           
            res.redirect('/admin/product');
        }
    } catch (error) {
        console.log(error.message)
    }
}

//block product
const blockProduct = async (req, res) => {
   

    try {
        const productId = req.params.id;
       
        const productvalue = await productSchema.findOne({ _id: productId });
      

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
       
        res.status(500).json({ message: "Internal server error" });
    }
};


const editProduct = async (req, res) => {
    try {
        const id = req.query.id;
     
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
  
        const id = req.query.id;
        
        const uploadedFiles = req.files;
        const requestData = req.body;
        const existingData = await productSchema.findOne({ _id: id })
        const img = [
            uploadedFiles?.image1 ? (uploadedFiles.image1[0]?.filename || existingData.images.image1) : existingData.images.image1,
            uploadedFiles?.image2 ? (uploadedFiles.image2[0]?.filename || existingData.images.image2) : existingData.images.image2,
            uploadedFiles?.image3 ? (uploadedFiles.image3[0]?.filename || existingData.images.image3) : existingData.images.image3,
            uploadedFiles?.image4 ? (uploadedFiles.image4[0]?.filename || existingData.images.image4) : existingData.images.image4,
        ];
     

        for (let i = 0; i < img.length; i++) {
            if (img[i]) {
                await sharp(`public/multerimg/${img[i]}`)
                    .resize(500, 500)
                    .toFile(`public/sharpimg/${img[i]}`);
            }
        }


        if (requestData.quantity > 0 && requestData.price > 0) {
           
            const product = {

                name: requestData.title,
                quantity: requestData.quantity,
                category: requestData.category,
                price: requestData.price,
                description: requestData.description,
                images: {
                    image1: img[0],
                    image2: img[1],
                    image3: img[2],
                    image4: img[3],
                },
            }
          
            const risult = await productSchema.findOneAndUpdate({ _id: id }, product, { new: true });
            risult.save();
         
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
        const Wishlist = await wishlistSchema.findOne({ user: req.session.user_id });





    
        const productData = await productSchema.find({
            name: { $regex: searchQuery, $options: 'i' },
        }).skip(prevPage * 4).limit(6);

        if (productData) {
            res.render('shop', { product: productData, category: categoryData, userId, searchQuery, totalDoc, page, prevPage, Wishlist })


        } else {
            const message = "product not find";
            res.render('shop', { product: productData, category: categoryData, userId, searchQuery, totalDoc, page, prevPage, message, Wishlist });

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
     
        const categoryData = await categorySchema.find({});
        const totalDoc = await productSchema.countDocuments();
        const Wishlist = await wishlistSchema.findOne({ user: req.session.user_id });

        if (category == "all") {
          
            const productData = await productSchema.find({

                name: { $regex: searchQuery, $options: 'i' },
                price: { $gte: fromprice, $lte: toprice }
            }).sort({ price: sort === 0 ? 1 : -1 }).skip(prevPage * 4).limit(6);

            res.render('shop', { product: productData, category: categoryData, userId, totalDoc, searchQuery, page, prevPage, Wishlist })

        } else {
           
            const productData = await productSchema.find({
                name: { $regex: searchQuery, $options: 'i' },
                price: { $gte: fromprice, $lte: toprice },
                category: category
            }).sort({ price: sort === 0 ? 1 : -1 }).skip(prevPage * 4).limit(6);
      

            res.render('shop', { product: productData, category: categoryData, userId, totalDoc, searchQuery, page, prevPage, Wishlist })
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
    productsearching,
}