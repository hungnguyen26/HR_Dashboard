// [GET] /departments
module.exports.index = async (req,res)=>{
    res.render("pages/department/index.ejs", {
        pageTitle: "Quản lý phòng ban"
    });
}

// [GET] /departments/create
module.exports.createDepartment = async (req,res)=>{
    res.render("pages/department/create.ejs", {
        pageTitle: "Thêm phòng ban"
    });
}

