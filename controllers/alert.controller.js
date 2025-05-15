const { Op, Sequelize  } = require('sequelize');
const dbHuman = require('../model/human/index.model'); 
const dbPayroll = require('../model/payroll/index.model'); 

module.exports.index = async (req, res) => {
  try {
    const currentUser = res.locals.User;

    const employee = await dbHuman.Employee.findOne({
      where: { Email: currentUser.Email }
    });

    if (!employee) {
      req.flash('error', 'Không tìm thấy thông tin nhân viên.');
      return res.redirect('/');
    }

    const alerts = [];

    const today = new Date();
    const hireDate = new Date(employee.HireDate);
    let anniversary = new Date(today.getFullYear(), hireDate.getMonth(), hireDate.getDate());
    if (anniversary < today) anniversary.setFullYear(today.getFullYear() + 1);
    const diffDays = Math.ceil((anniversary - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      alerts.push({
        type: 'work-anniversary',
        message: `🎉 Sắp đến ngày kỷ niệm làm việc (${diffDays} ngày nữa)!`
      });
    }

    const leaveStats = await dbPayroll.Attendance.findAll({
      where: {
        EmployeeID: employee.EmployeeID,
        AttendanceMonth: {
          [Op.gte]: Sequelize.literal(`DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3 MONTH), '%Y-%m-01')`)
        }
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('LeaveDays')), 'totalLeaveDays']
      ],
      raw: true
    });

    const totalLeave = parseFloat(leaveStats[0].totalLeaveDays || 0);
    if (totalLeave >= 10) {
      alerts.push({
        type: 'leave-warning',
        message: `⚠️ Bạn đã nghỉ phép ${totalLeave} ngày trong 3 tháng qua.`
      });
    }

    const salaryData = await dbPayroll.Salary.findAll({
      where: {
        EmployeeID: employee.EmployeeID
      },
      order: [['SalaryMonth', 'DESC']],
      limit: 2,
      raw: true
    });

    if (salaryData.length === 2) {
      const currentSalary = parseFloat(salaryData[0].NetSalary || salaryData[0].TotalSalary || 0);
      const previousSalary = parseFloat(salaryData[1].NetSalary || salaryData[1].TotalSalary || 0);

      const diff = Math.abs(currentSalary - previousSalary);
      const percentDiff = (diff / previousSalary) * 100;

      if (percentDiff >= 20) {
        alerts.push({
          type: 'salary-diff',
          message: `💸 Cảnh báo: Lương tháng này thay đổi ${percentDiff.toFixed(2)}% so với tháng trước.`
        });
      }
    }

    res.render('pages/alerts/index.ejs', {
      pageTitle: 'Thông báo',
      alerts,
    });

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu cảnh báo:', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu cảnh báo.');
  }
};