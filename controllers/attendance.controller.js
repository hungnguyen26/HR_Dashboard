const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");

// [GET] /attendance
module.exports.index = async (req, res) => {
    try {
      const attendances = await dbPayroll.Attendance.findAll({
        include: {
          model: dbHuman.Employee,
          attributes: ['EmployeeID', 'FullName']
        }
      });
      res.render("pages/attendance/index.ejs", {
        pageTitle: "Quản lý chấm công",
        attendances
      });
    } catch (error) {
      console.log(error);
    }
};
  
// [GET] /attendance/create
module.exports.createAttendance = async (req, res) => {
  try {

    const employees = await dbHuman.Employee.findAll({
      order: [['FullName', 'ASC']]
    })
    
    res.render("pages/attendance/create.ejs", {
      pageTitle: "Thêm chấm công",
      employees
    });
  } catch (error) {
    console.log(error);
  }
};

// [POST] /attendance/create
module.exports.createAttendancePost = async (req, res) => {
  try {
    const { EmployeeID, WorkDays, AbsentDays, LeaveDays, AttendanceMonth } = req.body;
    const existing = await dbPayroll.Attendance.findOne({
      where: {
        EmployeeID,
        AttendanceMonth
      }
    });

    if (existing) {
      req.flash('thatbai', `Nhân viên ${EmployeeID} đã được chấm công cho tháng ${AttendanceMonth}.`);
      return res.redirect('/attendance/create');
    } 
    await dbPayroll.Attendance.create({
      EmployeeID,
      WorkDays,
      AbsentDays,
      LeaveDays,
      AttendanceMonth,
    });
    
    req.flash("thanhcong", "Thêm chấm công thành công!");
    res.redirect("/attendance");
  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Thêm chấm công thất bại!");
    res.redirect("/attendance/create");
  }
};
  