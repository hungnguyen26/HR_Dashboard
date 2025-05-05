const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");

// [GET] /payroll
module.exports.index = async (req,res)=>{
    res.render("pages/payroll/index.ejs", {
        pageTitle: "Quản lý bảng lương"
    });
}

// [GET] /payroll/create
module.exports.createPayroll = async (req,res)=>{
    const employees = await dbHuman.Employee.findAll({
          order: [['FullName', 'ASC']]
        })
    res.render("pages/payroll/create.ejs", {
        pageTitle: "Tạo mới bảng lương",
        employees
    });
}
