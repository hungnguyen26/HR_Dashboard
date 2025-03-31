
// [GET] /employees
module.exports.index = async (req,res)=>{
    res.render("pages/employees/index.ejs", {
        pageTitle: "Quản lý nhân viên"
    });
}