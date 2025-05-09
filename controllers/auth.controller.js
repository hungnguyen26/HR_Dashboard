const { User, Role } = require("../model/auth/index.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dbAuth = require("../model/auth/index.model");
const dbHuman = require("../model/human/index.model");

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

// [POST] /auth/register
module.exports.registerPost = async (req,res)=>{
    try {
    const { email, fullName, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("thatbai", "Mật khẩu và xác nhận mật khẩu không khớp.");
      return res.redirect("back");
    }

    const existingUser = await dbAuth.User.findOne({ where: { Email: email } });
    if (existingUser) {
      req.flash("thatbai", "Email này đã được đăng ký.");
      return res.redirect("back");
    }

    const employee = await dbHuman.Employee.findOne({ where: { Email: email } });
    if (!employee) {
      req.flash("thatbai", "Email không tồn tại trong hệ thống nhân sự.");
      return res.redirect("back");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = await dbAuth.User.create({
      Username: fullName,
      PasswordHash: passwordHash,
      Email: email,
      CreatedAt: dbAuth.Sequelize.literal("GETDATE()"),
      EmployeeID: employee.EmployeeID, 
    });

    const employeeRole = await dbAuth.Role.findOne({
      where: { RoleName: "Employee" }
    });

    if (!employeeRole) {
      req.flash("thatbai", "Chức vụ 'Employee' không tồn tại.");
      return res.redirect("back");
    }

    await dbAuth.UserRole.create({
      UserID: newUser.UserID,
      RoleID: employeeRole.RoleID,
    });
        
    req.flash("thanhcong", "Thêm tài khoản thành công!");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Thêm tài khoản thất bại!");
    res.redirect("/");
  }
}