const dbPayroll = require("../model/payroll/index.model");
const dbHuman = require("../model/human/index.model");

// [GET] /attendance
module.exports.index = async (req, res) => {
  try {
    const { EmployeeID, FullName, AttendanceMonth, page = 1 } = req.query;

    const limit = 5;
    const offset = (page - 1) * limit;

    const Sequelize = dbPayroll.Sequelize;
    const { Op } = Sequelize;

    const whereClause = {};

    if (EmployeeID) {
      whereClause.EmployeeID = EmployeeID;
    }

    if (AttendanceMonth) {
      whereClause.AttendanceMonth = AttendanceMonth;
    }

    const includeClause = {
      model: dbHuman.Employee,
      attributes: ['EmployeeID', 'FullName'],
      required: true,
      where: {},
    };

    if (FullName) {
      includeClause.where.FullName = {
        [Op.like]: `%${FullName}%`,
      };
    }

    const totalCount = await dbPayroll.Attendance.count({
      where: whereClause,
      include: includeClause.where.FullName ? [includeClause] : undefined,
    });

    const attendances = await dbPayroll.Attendance.findAll({
      where: whereClause,
      include: includeClause,
      order: [['AttendanceMonth', 'DESC']],
      limit,
      offset,
    });

    const totalPage = Math.ceil(totalCount / limit);

    res.render("pages/attendance/index.ejs", {
      pageTitle: "Quản lý chấm công",
      attendances,
      query: req.query,
      pagination: {
        currentPage: parseInt(page),
        totalPage,
      },
    });

  } catch (error) {
    console.log(error);
    req.flash("thatbai", "Có lỗi xảy ra.");
    return res.redirect("back");
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

// [GET] /attendance/edit/{id}
module.exports.updateAttendance = async (req, res) => {
  const id = req.params.id;

  try {
    const attendance = await dbPayroll.Attendance.findByPk(id);
    if (!attendance) {
      req.flash("error", "Không tìm thấy bản ghi.");
      return res.redirect("/attendance");
    }

    res.render("pages/attendance/update", {
      pageTitle: "Cập nhật chấm công",
      attendance
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Lỗi khi tải dữ liệu.");
    res.redirect("/attendance");
  }
};

// [PATCH] /attendance/edit/{id}
module.exports.updateAttendancePatch = async (req, res) => {
  const id = req.params.id;
  const {
    WorkDays,
    AbsentDays,
    LeaveDays,
    AttendanceMonth
  } = req.body;
  try {
    const attendance = await dbPayroll.Attendance.findByPk(id);
    if (!attendance) {
      req.flash("thatbai", "Không tìm thấy bản ghi chấm công");
      return res.redirect("/attendance");
    }

    await attendance.update({
      WorkDays,
      AbsentDays,
      LeaveDays,
      AttendanceMonth
    });

    req.flash("thanhcong", "Cập nhật chấm công thành công!");
    res.redirect("/attendance");
  } catch (error) {
    console.log(error);
    res.redirect("/attendance");
  }
};

// [DELETE] /attendance/delete/:id
module.exports.deleteAttendance = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await dbPayroll.Attendance.destroy({
      where: { AttendanceID: id }
    });

    if (deleted) {
      req.flash("thanhcong", "Xóa chấm công thành công.");
    } else {
      req.flash("thatbai", "Không tìm thấy bản ghi để xóa.");
    }

    res.redirect("/attendance");
  } catch (error) {
    console.error(error);
    req.flash("thatbai", "Đã xảy ra lỗi khi xóa chấm công.");
    res.redirect("/attendance");
  }
  };
  

// [GET] /attendance/days?EmployeeID=&AttendanceMonth=
module.exports.getWorkingDays = async (req, res) => {
  try {
    const { EmployeeID, AttendanceMonth } = req.query;

    if (!EmployeeID || !AttendanceMonth) {
      return res.status(400).json({ error: "Thiếu thông tin truy vấn." });
    }
    const record = await dbPayroll.Attendance.findOne({
      where: {
        EmployeeID,
        AttendanceMonth,
      },
    });

    if (!record) {
      return res.json({ days: 0 });
    }
    return res.json({ days: record.WorkDays });
  } catch (error) {
    console.error("Lỗi khi lấy số ngày công:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

