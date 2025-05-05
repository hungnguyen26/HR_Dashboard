// [GET] /auth/login
module.exports.login = async (req,res)=>{
    res.render("pages/auth/login.ejs", {
        pageTitle: "Đăng nhập",
        layout: 'layouts/auth'
    });
}