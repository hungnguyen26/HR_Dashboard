const { Employee } = require("../model/human/index.model");
const searchHelper = require("../helpers/search");


// [GET] /employees
module.exports.index = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const cleanEmployees = employees.map(employee => employee.dataValues);

    res.render("pages/employees/index.ejs", {
      pageTitle: "Quản lý nhân viên",
      cleanEmployees
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /employees/create
module.exports.createEmployees = async (req, res) => {
  res.render("pages/employees/create.ejs", {
    pageTitle: "Thêm nhân viên",
  });
};

// [POST] /employees/create
module.exports.createEmployeesPost = async (req, res) => {
  try {
    console.log(req.body);
    
    req.flash("thanhcong", "Thêm nhân viên thành công!");
    // req.flash("thatbai", "Thêm nhân viên thất bại!");
    res.redirect("/employees"); 
  } catch (error) {
    console.log(error);
    res.redirect("/employees/create")
  }
};


