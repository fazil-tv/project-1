
const bannerSchema = require('../model/bannerModel');




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
        res.render("editbanner",{bannerData});
    } catch (error) {
        console.log(error.message);
    }
}
const editbannerpost = async (req, res) => {
    try {

        const bannerId = req.qury.id;
        const bannerData = await bannerSchema.findOne({ _id: bannerId })

        res.redirect("/banner");
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
    await data.save()

    res.redirect('/admin/banner')
    console.log(data);
    res.render("addbanner");
}




module.exports = {
    banner,
    addbanner,
    addbannerpost,
    editbanner,
    editbannerpost
}