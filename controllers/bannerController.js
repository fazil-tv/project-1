
const bannerSchema = require('../model/bannerModel');
const fs = require('fs');




const banner = async (req, res) => {
    try {
        const banner = await bannerSchema.find({});
        console.log(banner
        )
        res.render("banner", { banner });
    } catch (error) {
        console.log(error.message);
    }
}


const addbanner = async (req, res) => {
    try {
        res.render("addbanner");
    } catch (error) {
        console.log(error.message);
    }
}

const editbanner = async (req, res) => {
    try {
        const bannerId = req.query.id;
        const bannerData = await bannerSchema.findOne({ _id: bannerId })

        console.log(bannerId, "oooooop");
        console.log(bannerData, "klklk");
        res.render("editbanner", { bannerData });
    } catch (error) {
        console.log(error.message);
    }
}




const addbannerpost = async (req, res) => {
    const uploadedFiles1 = req.file.originalname
    console.log(uploadedFiles1);
    const data = new bannerSchema({
        title: req.body.title,
        description: req.body.description,
        images: uploadedFiles1,
        targeturl: req.body.targeturl
    })
    await data.save();

    res.redirect('/admin/banner')
    console.log(data);
    res.render("addbanner");
}



const editbannerpost = async (req, res) => {
    const uploadedFiles1 = req.file.originalname
    console.log(uploadedFiles1);
    try {

        const bannerId = req.query.id;
        console.log(bannerId, "kkkkkk")


        const bannerData = await bannerSchema.findOne({ _id: bannerId });
        console.log(bannerData, "jjjjj0");
        let imagePathOriginal;

        if (req.file && req.file.originalname) {
            image = req.file.originalname;
            imagePathOriginal = `public/assets/images/banner/${bannerData.images}`;
            // await fs.promises.unlink(imagePathOriginal);
        } else {
            image = bannerData.images;
        }

        console.log(imagePathOriginal);

        await bannerSchema.findOneAndUpdate(
            { _id: bannerId },
            {
                title: req.body.title,
                description: req.body.description,
                targeturl: req.body.targeturl,
                images: image,
            }
        );

        res.redirect('/admin/banner');

    } catch (error) {
        console.log(error.message);
    }
}


const listbanner = async (req, res) => {

    const bannerId = req.body.bannerId
    console.log(bannerId);
    const bannerDatas = await bannerSchema.findOne({ _id: bannerId })

    if (bannerDatas.is_blocked === true) {
        bannerDatas.is_blocked = false;
        console.log(bannerDatas);

        res.json({ status: false });



    } else {
        bannerDatas.is_blocked = true;
        console.log(bannerDatas);
        
        res.json({ status: true });

    }
    await bannerDatas.save()





}




module.exports = {
    banner,
    addbanner,
    addbannerpost,
    editbanner,
    editbannerpost,
    listbanner
}