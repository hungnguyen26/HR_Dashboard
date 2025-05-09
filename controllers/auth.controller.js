const { User, Role } = require("../model/auth/index.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// [GET] /auth/login
module.exports.login = async (req,res)=>{
    res.render("pages/auth/login.ejs", {
        pageTitle: "Đăng nhập",
        layout: 'layouts/auth'
    });
}

// [POST] /auth/login
module.exports.loginPost = async (req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { Email: email }
        });
        if (!user) {
            req.flash("thatbai", "Email không tồn tại.");
            return res.redirect("/auth/login");
        }
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            req.flash("thatbai", "Không đúng mật khẩu.");
            return res.redirect("/auth/login");
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.Token = token;
        await user.save();  
        res.cookie("tokenUser", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });      
        res.redirect("/home");
    } catch (error) {
        console.log(error);
        res.render("pages/auth/login", {
            pageTitle: "Đã xảy ra lỗi khi đăng nhập.",
        });
    }
}

// [GET] /auth/logout
module.exports.logout = async (req,res)=>{
    res.clearCookie("tokenUser"); 
    res.redirect("/auth/login"); 
}


// [GET] /auth/register
module.exports.register = async (req,res)=>{
    res.render("pages/auth/register.ejs", {
        pageTitle: "Đăng ký",
        layout: 'layouts/auth'
    });
}