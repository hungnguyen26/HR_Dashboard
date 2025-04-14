const dbHuman = require("../model/human/index.model");
const dbPayroll = require("../model/payroll/index.model");
const searchHelper = require("../helpers/search");
const { where } = require("sequelize");

// [GET] /employees
module.exports.index = async (req, res) => {
  try {
    const employees = await dbHuman.Employee.findAll();
    const cleanEmployees = employees.map((employee) => employee.dataValues);

    res.render("pages/employees/index.ejs", {
      pageTitle: "Quản lý nhân viên",
      cleanEmployees,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /employees/create
module.exports.createEmployees = async (req, res) => {
  const departments = await dbHuman.Department.findAll();
  const positions = await dbHuman.Position.findAll();

  res.render("pages/employees/create.ejs", {
    pageTitle: "Thêm nhân viên",
    departments,
    positions,
  });
};

// [POST] /employees/create
module.exports.createEmployeesPost = async (req, res) => {
  try {
    const {
      FullName,
      DateOfBirth,
      Email,
      PhoneNumber,
      Gender,
      HireDate,
      DepartmentID,
      PositionID,
      Status,
    } = req.body;

    const existEmployee = await dbHuman.Employee.findOne({
      where: {
        [dbHuman.Sequelize.Op.or]: [
          { Email: Email },
          { PhoneNumber: PhoneNumber },
        ],
      },
    });

    if (existEmployee) {
      req.flash("thatbai", "Email hoặc SĐT đã tồn tại!");
      res.redirect("back");
    }

    const newEmployee = await dbHuman.Employee.create({
      FullName,
      DateOfBirth,
      Email,
      PhoneNumber,
      Gender,
      HireDate,
      DepartmentID,
      PositionID,
      Status,
      CreatedAt: dbHuman.Sequelize.literal("GETDATE()"),
      UpdatedAt: dbHuman.Sequelize.literal("GETDATE()"),
    });

    await dbPayroll.Employee.create({
      EmployeeID: newEmployee.EmployeeID,
      FullName,
      DepartmentID,
      PositionID,
      Status,
    });

    req.flash("thanhcong", "Thêm nhân viên thành công!");
    res.redirect("/employees");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Thêm nhân viên thất bại!");
    res.redirect("/employees/create");
  }
};
