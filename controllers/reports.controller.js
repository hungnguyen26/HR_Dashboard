const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");
const { Op } = require("sequelize");

module.exports.index = async (req, res) => {
  try {
    const employees = await dbHuman.Employee.findAll({
      include: [
        { model: dbHuman.Department, attributes: ['DepartmentName'] },
        { model: dbHuman.Position, attributes: ['PositionName'] }
      ],
      raw: true,
      nest: true,
    });
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
      cleanEmployees: employees,
      employeesByDepartment,
      totalEmployees,
      employeesByGender,
      salaryByMonth,
      departmentDistribution,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
    res.status(500).send("Lỗi hệ thống.");
  }
};
