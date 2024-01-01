// const category = require("../model/categoryModel");
// const { exists } = require("../model/userSchema");



// function editcategoryvalidation() {
//     event.preventDefault();
//     const categoryname = document.getElementById('editcategoryname').value
//     console.log(categoryname);
//     const editdiscription = document.getElementById('editcategorydescription').value

//     const isvalidatae = validateCategoryName(categoryname);


//     if (isvalidatae) {
//         console.log("category name is valid");
//     } else {
//         console.log("invalid category name");
//     }

//     const validateCategoryName = (categoryName) => {
//         const categoryRegex = /^[a-zA-Z0-9\s]+$/;
//         const isValid = categoryRegex.test(categoryName);

//         return isValid;
//     };

// }

// module.exports = {
//     editcategoryvalidation
// }