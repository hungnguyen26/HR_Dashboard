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
module.exports.createAccount = async (req, res) => {
    try {
        const allRoles = await dbAuth.Role.findAll(); 

        res.render("pages/account/create.ejs", {
            pageTitle: "Thêm tài khoản",
            allRoles, 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi tải form tạo tài khoản.");
    }
};


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

// [GET] /account/edit/:id
module.exports.editAccount = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await dbAuth.User.findByPk(userId, {
            include: [{
                model: dbAuth.Role,
                as: 'Roles',
                attributes: ['RoleName'],
            }]
        });

        const allRoles = await dbAuth.Role.findAll();

        if (!user) {
            req.flash("thatbai", "Không tìm thấy tài khoản.");
            return res.redirect("/account");
        }

        res.render("pages/account/update.ejs", {
            pageTitle: "Sửa tài khoản",
            user,
            allRoles,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi tải thông tin tài khoản.");
    }
};

module.exports.editAccountPatch = async (req, res) => {
    const userId = req.params.id;
    const { fullName, email, roleNames, newPassword, confirmPassword } = req.body;

    try {
        const user = await dbAuth.User.findByPk(userId);
        if (!user) {
            req.flash("thatbai", "Không tìm thấy tài khoản.");
            return res.redirect("/account");
        }

        const existingEmail = await dbAuth.User.findOne({
            where: {
                Email: email,
                UserID: { [dbAuth.Sequelize.Op.ne]: userId }
            }
        });

        if (existingEmail) {
            req.flash("thatbai", "Email đã được sử dụng bởi tài khoản khác.");
            return res.redirect("back");
        }

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                req.flash("thatbai", "Mật khẩu mới và xác nhận không khớp.");
                return res.redirect("back");
            }
            user.PasswordHash = bcrypt.hashSync(newPassword, 10);
        }

        user.Username = fullName;
        user.Email = email;
        await user.save();

        await dbAuth.UserRole.destroy({ where: { UserID: userId } });

        const roles = await dbAuth.Role.findAll({
            where: { RoleName: roleNames }  
        });

        const userRoles = roles.map(role => ({
            UserID: userId,
            RoleID: role.RoleID
        }));
        await dbAuth.UserRole.bulkCreate(userRoles);

        req.flash("thanhcong", "Cập nhật tài khoản thành công!");
        res.redirect("/account");

    } catch (error) {
        console.log(error);
        req.flash("thatbai", "Cập nhật tài khoản thất bại!");
        res.redirect("/account");
    }
}

// [DELETE] /delete/:id
module.exports.deleteAccount = async (req,res)=>{
    const userId = req.params.id;

    try {
        const user = await dbAuth.User.findByPk(userId);
        if (!user) {
            req.flash("thatbai", "Không tìm thấy tài khoản.");
            return res.redirect("/account");
        }

        await dbAuth.UserRole.destroy({
            where: { UserID: userId }
        });

        await dbAuth.User.destroy({
            where: { UserID: userId }
        });

        req.flash("thanhcong", "Xóa tài khoản thành công!");
        res.redirect("/account");
    } catch (error) {
        console.error(error);
        req.flash("thatbai", "Xóa tài khoản thất bại!");
        res.redirect("/account");
    }
}