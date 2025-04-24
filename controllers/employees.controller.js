const dbHuman = require("../model/human/index.model");
const dbPayroll = require("../model/payroll/index.model");
const searchHelper = require("../helpers/search");
const { where } = require("sequelize");

// [GET] /employees
module.exports.index = async (req, res) => {
  try {
    const { EmployeeID, FullName, DepartmentID, PositionID, page = 1 } = req.query;

    const limit = 5; 
    const offset = (page - 1) * limit;

    const searchConditions = {};

    if (EmployeeID) {
      searchConditions.EmployeeID = EmployeeID;
    }

    if (FullName) {
      searchConditions.FullName = {
        [dbHuman.Sequelize.Op.like]: `%${FullName}%`,
      };
    }

    if (DepartmentID) {
      searchConditions.DepartmentID = DepartmentID;
    }

    if (PositionID) {
      searchConditions.PositionID = PositionID;
    }

    const totalCount = await dbHuman.Employee.count({
      where: searchConditions,
    });

    const employees = await dbHuman.Employee.findAll({
      where: searchConditions,
      include: [
        { model: dbHuman.Department, required: false },
        { model: dbHuman.Position, required: false },
      ],
      limit,
      offset,
    });

    const cleanEmployees = employees.map((employee) => employee.dataValues);

    const departments = await dbHuman.Department.findAll();
    const positions = await dbHuman.Position.findAll();

    const totalPage = Math.ceil(totalCount / limit);

    res.render("pages/employees/index.ejs", {
      pageTitle: "Quản lý nhân viên",
      cleanEmployees,
      departments,
      positions,
      query: req.query,
      pagination: {
        currentPage: parseInt(page),
        totalPage,
      },
    });
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Có lỗi xảy ra!");
      return res.redirect("back");
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
      return res.redirect("back");
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

// [GET] /employees/edit/{id}
module.exports.updateEmployees = async (req, res) => {
  const employeeId = req.params.id;
  
  try {
    const employee = await dbHuman.Employee.findOne({
      where: {
        EmployeeID: employeeId
      }
    })

    if (!employee) {
      req.flash("thatbai", "Không tìm thấy nhân viên!");
      return res.redirect("/employees");
    }

    const departments = await dbHuman.Department.findAll();
    const positions = await dbHuman.Position.findAll();

    res.render("pages/employees/update.ejs", {
      pageTitle: "Cập nhật nhân viên",
      employee: employee.dataValues,
      departments,
      positions
    });

  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Cập nhật nhân viên thất bại!");
    res.redirect("/employees");
  }
  
};


// [POST] /employees/edit/{id}
module.exports.updateEmployeesPost = async (req, res) => {
  const employeeId = req.params.id;

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
        EmployeeID: {
          [dbHuman.Sequelize.Op.ne]: employeeId
        }
      },
    });

    if (existEmployee) {
      req.flash("thatbai", "Email hoặc SĐT đã tồn tại!");
      return res.redirect("back");
    }

    await dbHuman.Employee.update(
      {
        FullName,
        DateOfBirth,
        Email,
        PhoneNumber,
        Gender,
        HireDate,
        DepartmentID,
        PositionID,
        Status,
        UpdatedAt: dbHuman.Sequelize.literal("GETDATE()"),
      },
      { where: { EmployeeID: employeeId } }
    );

    await dbPayroll.Employee.update(
      {
        FullName,
        DepartmentID,
        PositionID,
        Status,
      },
      { where: { EmployeeID: employeeId } }
    );

    req.flash("thanhcong", "Cập nhật nhân viên thành công!");
    res.redirect("/employees");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Cập nhật nhân viên thất bại!");
    res.redirect("/employees");
  }
};

// [DELETE] /employees/delete/:id
module.exports.deleteEmployee = async (req, res) => {
  const employeeID = req.params.id;

  try {
    const dividend = await dbHuman.Dividend.findOne({
      where: { EmployeeID: employeeID }
    });
    // console.log("===========Dividend model:", dbHuman.Dividend);
    const payroll = await dbPayroll.Salary.findOne({
      where: { EmployeeID: employeeID }
    });

    if (dividend || payroll) {
      req.flash("thatbai", "Không thể xóa nhân viên do có dữ liệu liên quan (lương hoặc cổ tức)!");
      return res.redirect("/employees");
    }

    await dbPayroll.Employee.destroy({
      where: { EmployeeID: employeeID }
    });

    await dbHuman.Employee.destroy({
      where: { EmployeeID: employeeID }
    });

    req.flash("thanhcong", "Xóa nhân viên thành công!");
    res.redirect("/employees");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Có lỗi xảy ra khi xóa nhân viên!");
    res.redirect("/employees");
  }
};
