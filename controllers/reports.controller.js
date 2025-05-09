const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");
const { Op } = require("sequelize");

module.exports.index = async (req, res) => {
  try {
    const totalEmployees = await dbHuman.Employee.count();

    const employeesByGender = await dbHuman.Employee.findAll({
      attributes: [
        "Gender",
        [
          dbHuman.Sequelize.fn("COUNT", dbHuman.Sequelize.col("EmployeeID")),
          "count",
        ],
      ],
      group: ["Gender"],
      raw: true,
    });

    const employeesByDepartment = await dbHuman.Employee.findAll({
      attributes: [
        [dbHuman.Sequelize.col("Department.DepartmentName"), "DepartmentName"],
        [
          dbHuman.Sequelize.fn("COUNT", dbHuman.Sequelize.col("EmployeeID")),
          "count",
        ],
      ],
      include: [
        {
          model: dbHuman.Department,
          attributes: [],
        },
      ],
      group: ["Department.DepartmentName"],
      raw: true,
    });

    const salaryByMonth = await dbPayroll.Salary.findAll({
      attributes: [
        [
          dbPayroll.Sequelize.literal("DATE_FORMAT(SalaryMonth, '%Y-%m')"),
          "month",
        ],
        [
          dbPayroll.Sequelize.fn("SUM", dbPayroll.Sequelize.col("NetSalary")),
          "total",
        ],
      ],
      group: [dbPayroll.Sequelize.literal("DATE_FORMAT(SalaryMonth, '%Y-%m')")],
      order: [[dbPayroll.Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    // console.log(salaryByMonth);

    const departmentDistribution = await dbHuman.Employee.findAll({
      attributes: [
        [dbHuman.Sequelize.fn("COUNT", "*"), "total"],
        "DepartmentID",
        [dbHuman.Sequelize.col("Department.DepartmentName"), "DepartmentName"],
      ],
      group: ["Employee.DepartmentID", "Department.DepartmentName"],
      include: [
        {
          model: dbHuman.Department,
          attributes: [],
          required: true,
        },
      ],
      raw: true,
    });

    res.render("pages/reports/index.ejs", {
      pageTitle: "Báo cáo & Phân tích",
      totalEmployees,
      employeesByGender,
      employeesByDepartment,
      salaryByMonth,
      departmentDistribution,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
    res.status(500).send("Lỗi hệ thống.");
  }
};
