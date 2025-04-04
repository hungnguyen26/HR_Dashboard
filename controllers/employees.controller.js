
// [GET] /employees
module.exports.index = async (req,res)=>{
    res.render("pages/employees/index.ejs", {
        pageTitle: "Quản lý nhân viên"
    });
}

// [GET] /employees/create
module.exports.createEmployees = async (req,res)=>{
    res.render("pages/employees/create.ejs", {
        pageTitle: "Thêm nhân viên"
    });
}
