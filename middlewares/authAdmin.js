
const isLogin = async (req, res, next) => {

    try {
        if (req.session.admin_email) {
            next();
        } else {
            res.redirect('/admin/index');
        }

    } catch (error) {
        console.log(error);
        res.redirect('/admin/login');
    }



}

const isLogout = async (req, res, next) => {

    try {

        if (req.session.admin_email) {
            res.redirect('/admin/login');
        } else {
            next();
        }

    } catch (error) {

        console.log(error.message);

    }
}

module.exports = {
    isLogin,
    isLogout
}