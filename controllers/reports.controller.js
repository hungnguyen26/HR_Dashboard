const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");
const { Op } = require("sequelize");

module.exports.index = async (req, res) => {
  try {
    //nhân sự
    const totalEmployees = await dbHuman.Employee.count();
    const employeesByDepartment = await dbHuman.Employee.findAll({
      attributes: [
        [dbHuman.Sequelize.col("Department.DepartmentName"), "DepartmentName"],
        [
          dbHuman.Sequelize.fn(
            "COUNT",
            dbHuman.Sequelize.col("Employee.EmployeeID")
          ),
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

    const employeesByGender = await dbHuman.Employee.findAll({
      attributes: [
        "Gender",
        [
          dbHuman.Sequelize.fn(
            "COUNT",
            dbHuman.Sequelize.col("Employee.EmployeeID")
          ),
          "count",
        ],
      ],
      group: ["Gender"],
      raw: true,
    });

    //cổ tức
    const dividendsByMonth = await dbHuman.Dividend.findAll({
      attributes: [
        [
          dbHuman.Sequelize.fn(
            "FORMAT",
            dbHuman.Sequelize.col("DividendDate"),
            "yyyy-MM"
          ),
          "month",
        ],
        [
          dbHuman.Sequelize.fn("SUM", dbHuman.Sequelize.col("DividendAmount")),
          "total",
        ],
      ],
      group: [
        dbHuman.Sequelize.fn(
          "FORMAT",
          dbHuman.Sequelize.col("DividendDate"),
          "yyyy-MM"
        ),
      ],
      order: [[dbHuman.Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    // bảng lương
    const salaryByMonth = await dbPayroll.Salary.findAll({
      attributes: [
        [
          dbPayroll.Sequelize.literal(
            "FORMAT(SalaryMonth, 'yyyy-MM', 'en-US')"
          ),
          "month",
        ],
        [
          dbPayroll.Sequelize.fn("SUM", dbPayroll.Sequelize.col("NetSalary")),
          "total",
        ],
      ],
      group: [
        dbPayroll.Sequelize.literal("FORMAT(SalaryMonth, 'yyyy-MM', 'en-US')"),
      ],
      order: [[dbPayroll.Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    const salaryByDepartment = await dbPayroll.Salary.findAll({
      attributes: [
        [
          dbPayroll.Sequelize.fn("SUM", dbPayroll.Sequelize.col("NetSalary")),
          "total",
        ],
      ],
      include: [
        {
          model: dbPayroll.Employee, 
          attributes: [], 
          include: [
            {
              model: dbHuman.Department, 
              attributes: ["DepartmentName"], 
            },
          ],
        },
      ],
      group: ["Employee.DepartmentID", "Employee->Department.DepartmentID"], 
      raw: true,
    });
    const salaryByDepartmentFormat = salaryByDepartment.map((item) => ({
      total: parseFloat(item.total),
      departmentID: item["Employee.Department.DepartmentID"], 
      departmentName: item["Employee.Department.DepartmentName"], 
    }));

    //nhân sự theo phòng ban
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

    console.log(totalEmployees);
    console.log("=============");
    console.log(employeesByDepartment);
    console.log("=============");
    console.log(employeesByGender);
    console.log("=============");
    console.log(dividendsByMonth);
    console.log("=============");
    console.log(salaryByMonth);
    console.log("=============");
    console.log(salaryByDepartmentFormat);
    console.log("=============");
    console.log(departmentDistribution);

    res.render("pages/reports/index.ejs", {
      pageTitle: "Báo cáo & Phân tích",
      totalEmployees,
      employeesByDepartment,
      employeesByGender,
      dividendsByMonth,
      salaryByMonth,
      salaryByDepartmentFormat,
      departmentDistribution,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
    res.status(500).send("Lỗi hệ thống.");
  }
};
