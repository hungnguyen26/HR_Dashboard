// const moment = require('moment');
// const { Employee } = require('../model/human/index.model');
// const { Salary } = require('../model/payroll/index.model');

// // Cảnh báo kỷ niệm ngày làm việc
// const getAnniversaryAlerts = async () => {
//   const employees = await Employee.findAll();
//   const today = moment();

//   return employees
//     .map(emp => {
//       const startDate = moment(emp.StartDate);
//       const years = today.diff(startDate, 'years');
//       const nextAnniversary = startDate.clone().add(years + 1, 'years');
//       const daysUntil = nextAnniversary.diff(today, 'days');

//       if (daysUntil <= 30 && daysUntil >= 0) {
//         return {
//           employee: emp,
//           message: `Nhân viên ${emp.FullName} sắp kỷ niệm ${years + 1} năm làm việc vào ngày ${nextAnniversary.format('DD/MM/YYYY')}.`
//         };
//       }
//       return null;
//     })
//     .filter(alert => alert !== null);
// };

// // Cảnh báo ngày nghỉ phép
// const getLeaveAlerts = async () => {
//   const employees = await Employee.findAll();

//   return employees
//     .map(emp => {
//       const usedLeave = emp.UsedLeaveDays;
//       const remainingLeave = emp.TotalLeaveDays - usedLeave;

//       if (usedLeave / emp.TotalLeaveDays >= 0.8) {
//         return {
//           employee: emp,
//           message: `Nhân viên ${emp.FullName} đã sử dụng ${usedLeave} ngày phép, chiếm hơn 80% tổng số ngày phép.`
//         };
//       } else if (remainingLeave <= 5) {
//         return {
//           employee: emp,
//           message: `Nhân viên ${emp.FullName} chỉ còn ${remainingLeave} ngày phép.`
//         };
//       }
//       return null;
//     })
//     .filter(alert => alert !== null);
// };

// // Cảnh báo chênh lệch lương
// const getSalaryAlerts = async () => {
//   const employees = await Employee.findAll();
//   const salaryAlerts = [];

//   for (const emp of employees) {
//     const salaries = await Salary.findAll({
//       where: { EmployeeID: emp.EmployeeID },
//       order: [['SalaryMonth', 'DESC']],
//       limit: 2
//     });

//     if (salaries.length === 2) {
//       const [latest, previous] = salaries;
//       const diff = Math.abs(latest.NetSalary - previous.NetSalary);
//       const diffPercent = (diff / previous.NetSalary) * 100;

//       if (diffPercent >= 20) {
//         salaryAlerts.push({
//           employee: emp,
//           message: `Lương của nhân viên ${emp.FullName} thay đổi ${diffPercent.toFixed(2)}% giữa tháng ${previous.SalaryMonth} và ${latest.SalaryMonth}.`
//         });
//       }
//     }
//   }

//   return salaryAlerts;
// };

// // Controller chính cho router /alerts
// module.exports.index = async (req, res) => {
//   try {
//     const [anniversaryAlerts, leaveAlerts, salaryAlerts] = await Promise.all([
//       getAnniversaryAlerts(),
//       getLeaveAlerts(),
//       getSalaryAlerts()
//     ]);

//     res.render('pages/alerts/index.ejs', {
//     pageTitle :"Thông báo",
//       anniversaryAlerts,
//       leaveAlerts,
//       salaryAlerts
//     });
//   } catch (error) {
//     console.error('Lỗi khi lấy dữ liệu cảnh báo:', error);
//     res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu cảnh báo.');
//   }
// };
