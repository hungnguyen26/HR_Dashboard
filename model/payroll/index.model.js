const { payrollSequelize } = require("../../config/database");
const Sequelize = require("sequelize");

const Department = require("./departments.model")(payrollSequelize, Sequelize.DataTypes);
const Position = require("./positions.model")(payrollSequelize, Sequelize.DataTypes);
const Employee = require("./employees.model")(payrollSequelize, Sequelize.DataTypes);
const Attendance = require("./attendance.model")(payrollSequelize, Sequelize.DataTypes);
const Salary = require("./salaries.model")(payrollSequelize, Sequelize.DataTypes);

Employee.belongsTo(Department, { foreignKey: "DepartmentID" });
Employee.belongsTo(Position, { foreignKey: "PositionID" });
Attendance.belongsTo(Employee, { foreignKey: "EmployeeID" });
Salary.belongsTo(Employee, { foreignKey: "EmployeeID" });

module.exports = {
  payrollSequelize,
  Sequelize,
  Department,
  Position,
  Employee,
  Attendance,
  Salary
};
