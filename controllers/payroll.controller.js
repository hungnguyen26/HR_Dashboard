const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");
const { Employee } = require("../model/human/index.model");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// [GET] /payroll
module.exports.index = async (req, res) => {
  try {
    const {
      EmployeeID,
      FullName,
      DepartmentID,
      SalaryMonth,
      page = 1,
    } = req.query;

    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;

    const whereSalary = {};
    if (SalaryMonth) whereSalary.SalaryMonth = SalaryMonth;

    // Bước 1: Lấy danh sách Salary
    const { count, rows: salaryList } = await dbPayroll.Salary.findAndCountAll({
      where: whereSalary,
      limit,
      offset,
      order: [["CreatedAt", "DESC"]],
    });

    const employeeIDs = salaryList.map((s) => s.EmployeeID);

    // Bước 2: Lấy thông tin Employee từ HUMAN_2025
    const employeeWhere = {
      EmployeeID: { [Op.in]: employeeIDs },
    };

    if (EmployeeID) employeeWhere.EmployeeID = EmployeeID;
    if (FullName) {
      employeeWhere.FullName = { [Op.like]: `%${FullName}%` };
    }
    if (DepartmentID) {
      employeeWhere.DepartmentID = DepartmentID;
    }

    const employeeList = await dbHuman.Employee.findAll({
      where: employeeWhere,
      include: [{ model: dbHuman.Department }],
    });

    // Bước 3: Gộp dữ liệu
    const employeeMap = {};
    employeeList.forEach((emp) => {
      employeeMap[emp.EmployeeID] = emp;
    });

    const salaries = salaryList
      .filter((s) => employeeMap[s.EmployeeID])
      .map((s) => {
        return {
          ...s.get(),
          Employee: employeeMap[s.EmployeeID],
        };
      });

    // Bước 4: Phòng ban cho bộ lọc
    const departments = await dbHuman.Department.findAll();

    res.render("pages/payroll/index", {
      pageTitle: "Quản lý lương nhân viên",
      salaries,
      departments,
      query: req.query,
      pagination: {
        currentPage: parseInt(page),
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    req.flash("thatbai", "Lỗi khi tải bảng lương");
    return res.redirect("back");
  }
};

// [GET] /payroll/create
module.exports.createPayroll = async (req, res) => {
  const employees = await dbHuman.Employee.findAll({
    order: [["FullName", "ASC"]],
  });
  res.render("pages/payroll/create.ejs", {
    pageTitle: "Tạo mới bảng lương",
    employees,
  });
};

// [POST] /payroll/create
module.exports.createPayrollPost = async (req, res) => {
  try {
    const {
      EmployeeID,
      SalaryMonth,
      WorkingDays,
      BaseSalary,
      Bonus,
      Deductions,
      NetSalary,
    } = req.body;

    const existing = await dbPayroll.Salary.findOne({
      where: {
        EmployeeID,
        SalaryMonth,
      },
    });

    if (existing) {
      req.flash(
        "thatbai",
        "Bảng lương cho nhân viên này trong tháng đã tồn tại."
      );
      return res.redirect("/payroll/create");
    }

    const salary = await dbPayroll.Salary.create({
      EmployeeID,
      SalaryMonth,
      WorkingDays,
      BaseSalary,
      Bonus: Bonus || 0,
      Deductions: Deductions || 0,
      NetSalary,
    });

    const employee = await Employee.findOne({
      where: { EmployeeID },
    });
    console.log(employee.Email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employee.Email,
      subject: `Thông báo bảng lương tháng ${SalaryMonth}`,
      text: `Chào ${
        employee.FullName
      },\n\nBảng lương của bạn cho tháng ${SalaryMonth} đã được tạo thành công.\nMức lương là: ${NetSalary.toLocaleString(
        "vi-VN"
      )} đ.\n\nTrân trọng,\nHR Team`,
    };

    await transporter.sendMail(mailOptions);

    req.flash("thanhcong", "Tạo bảng lương thành công và email đã được gửi.");
    res.redirect("/payroll");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Có lỗi xảy ra khi thêm bảng lương!");
    res.redirect("/payroll/create");
  }
};

// [GET] /payroll/edit/{id}
module.exports.editPayroll = async (req, res) => {
  try {
    const salaryId = req.params.id;
    const salary = await dbPayroll.Salary.findByPk(salaryId);
    if (!salary) {
      req.flash("thatbai", "Không tìm thấy bảng lương!");
      return res.redirect("/payroll");
    }
    const employee = await dbHuman.Employee.findOne({
      where: { EmployeeID: salary.EmployeeID },
      include: [{ model: dbHuman.Department }],
    });
    
    res.render("pages/payroll/edit", {
      pageTitle: "Chỉnh sửa bảng lương",
      salary,
      employee,
    });
  } catch (err) {
    console.error(err);
    req.flash("thatbai", "Lỗi khi tải bảng lương");
  }
};

// [PATCH] /payroll/edit/{id}
module.exports.editPayrollPatch = async (req, res) => {
  const  SalaryID  = req.params.id;
  const { BaseSalary, Bonus, Deductions, NetSalary } = req.body;
  try {
    const salary = await dbPayroll.Salary.findByPk(SalaryID);
    
    if (!salary) {
      req.flash("thatbai", "Không tìm thấy bản ghi lương.");
      console.log("loidfdsifhsihdf");
      
      return res.redirect("/payroll");
    }

    await salary.update({
      BaseSalary,
      Bonus,
      Deductions,
      NetSalary,
    });

    req.flash("thanhcong", "Cập nhật bảng lương thành công!");
    res.redirect("/payroll");
  } catch (err) {
    console.error("Lỗi cập nhật bảng lương:", err);
    req.flash("thatbai", "Đã xảy ra lỗi khi cập nhật bảng lương.");
    res.redirect("/payroll");
  }
};

// [DELETE] /payroll/delete/{id}
module.exports.deletePayroll = async (req, res) => {
  const SalaryID = req.params.id;

  try {
    const salary = await dbPayroll.Salary.findByPk(SalaryID);

    if (!salary) {
      req.flash("thatbai", "Không tìm thấy bảng lương cần xóa.");
      return res.redirect("/payroll");
    }

    await salary.destroy();

    req.flash("thanhcong", "Xóa bảng lương thành công!");
    res.redirect("/payroll");
  } catch (err) {
    console.error("Lỗi khi xóa bảng lương:", err);
    req.flash("thatbai", "Đã xảy ra lỗi khi xóa bảng lương.");
    res.redirect("/payroll");
  }
};


// [GET] /payroll/mine
module.exports.minePayroll = async (req, res) => {
  const UserLocal = res.locals.User.dataValues;
  try {
    const salaries = await dbPayroll.Salary.findAll({
      where: { EmployeeID: UserLocal.EmployeeID },
      order: [["SalaryMonth", "DESC"]],
    });

    const salariesWithAttendance = await Promise.all(
      salaries.map(async (salary) => {
        const salaryMonth = new Date(salary.SalaryMonth);
        const firstDayOfMonth = new Date(
          salaryMonth.getFullYear(),
          salaryMonth.getMonth(),
          1
        );

        const attendance = await dbPayroll.Attendance.findOne({
          where: {
            EmployeeID: UserLocal.EmployeeID,
            AttendanceMonth: firstDayOfMonth,
          },
        });

        return {
          ...salary.dataValues,
          WorkDays: attendance ? attendance.WorkDays : 0,
          AbsentDays: attendance ? attendance.AbsentDays : 0,
          LeaveDays: attendance ? attendance.LeaveDays : 0,
        };
      })
    );

    // console.log(salariesWithAttendance);

    res.render("pages/payroll/mine", {
      pageTitle: "Bảng lương cá nhân",
      salaries: salariesWithAttendance,
    });
  } catch (err) {
    console.error(err);
    req.flash("thatbai", "Lỗi khi tải bảng lương");
    return res.redirect(req.get("Referrer") || "/");
  }
};
