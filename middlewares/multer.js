
const multer = require("multer");


const localStorage = multer.diskStorage({
    
    destination:"public/multerimg",
    filename:(req,file,callcack)=>{
        const filename = file.originalname;
        callcack(null,filename);
    }
})


const product = multer({storage:localStorage});
const uploadProduct = product.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]);

module.exports={
    uploadProduct,
}

