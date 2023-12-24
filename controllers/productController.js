const productSchema = require("../model/productSchema");
const userSchema = require("../model/categoryModel");
const categorySchema = require("../model/categoryModel");




// product
const Product = async (req, res) => {
    try {
        res.render("product");
    } catch (error) {
        console.log(error.message);
    }
}

// addproduct
const addproduct = async (req, res) => {
    try {
        res.render("addproduct");
    } catch (error) {
        console.log(error.message);
    }
}









module.exports={
    Product,
    addproduct,
}