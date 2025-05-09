const bcrypt = require('bcryptjs');
const dbAuth = require("../model/auth/index.model");


// [GET] /account
module.exports.index = async (req,res)=>{
    try {
        const users = await dbAuth.User.findAll({
            include: [{
                model: dbAuth.Role,
                as: 'Roles',
                attributes: ['RoleName'], 
            }],
        });

        // console.log(users);
        
        res.render('pages/account/index.ejs', {
            pageTitle: 'Danh sách tài khoản',
            users,  
            messages: req.flash('messages'), 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách tài khoản.');
    }
}

// [GET] /account/create
module.exports.createAccount = async (req,res)=>{
    res.render("pages/account/create.ejs", {
        pageTitle: "Thêm tài khoản",
    });
}

// [POST] /account/create
module.exports.createAccountPost = async (req,res)=>{
    try {
        const { email, fullName, password, confirmPassword, roleNames } = req.body;
    
        if (password !== confirmPassword) {
            req.flash("thatbai", "Mật khẩu và xác nhận mật khẩu không khớp.");
            return res.redirect("back");
        }
    
        const existingUser = await dbAuth.User.findOne({ where: { email } });
        if (existingUser) {
            req.flash("thatbai", "Email này đã được đăng ký.");
            return res.redirect("back");
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        const newUser = await dbAuth.User.create({
            Username: fullName,  
            PasswordHash: passwordHash,
            Email: email,
            CreatedAt: dbAuth.Sequelize.literal("GETDATE()"),
        });
    
    
        const roles = await dbAuth.Role.findAll({
            where: {
                RoleName: roleNames  
            }
        });
    
        if (roles.length === 0) {
            req.flash("thatbai", "Chức vụ không hợp lệ.");
            return res.redirect("back");
        }
    
        const userRolePromises = roles.map(role => 
            dbAuth.UserRole.create({
                UserID: newUser.UserID,
                RoleID: role.RoleID,
            })
        );
        await Promise.all(userRolePromises); 
    
        req.flash("thanhcong", "Thêm tài khoản thành công!");
        res.redirect("/account");
    
    } catch (error) {
        console.log(error);
        req.flash("thatbai", "Thêm tài khoản thất bại!");
        res.redirect("/account");
    }
    
    
}
