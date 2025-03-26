
module.exports.index = async (req,res)=>{
    res.render("pages/payroll/index.ejs", {
        pageTitle: "Quản lý bảng lương"
    });
}