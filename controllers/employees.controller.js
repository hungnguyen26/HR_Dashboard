const { Employee } = require("../model/human/index.model");
const searchHelper = require("../helpers/search");


// [GET] /employees
module.exports.index = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const cleanEmployees = employees.map(employee => employee.dataValues);

    console.log(cleanEmployees);

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
