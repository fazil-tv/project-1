
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


// const BannerStorage = multer.localStorage({
//     destination: "public/assets/images/banner",

//     filename:(req,file,callcack)=>{
//         const filename = file.originalname;
//         callcack(null,filename)
//     }
// })

// const uploadBanner = multer({ storage:BannerStorage})




const BannerStorage = multer.diskStorage({
    destination: "public/assets/images/banner",
    filename: (req, file, callback) => {
        const filename = file.originalname;
        callback(null, filename);
    }
});

const uploadBanner = multer({ storage: BannerStorage });



module.exports={
    uploadProduct,
    uploadBanner
}


