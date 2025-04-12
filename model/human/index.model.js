const { hrSequelize } = require("../../config/database"); 
const Sequelize = require("sequelize");

const Department = require("./departments.model")(hrSequelize, Sequelize.DataTypes);
const Position = require("./positions.model")(hrSequelize, Sequelize.DataTypes);
const Employee = require("./employees.model")(hrSequelize, Sequelize.DataTypes);
const Dividend = require("./dividends.model")(hrSequelize, Sequelize.DataTypes);

Employee.belongsTo(Department, { foreignKey: "DepartmentID" });
Employee.belongsTo(Position, { foreignKey: "PositionID" });
Dividend.belongsTo(Employee, { foreignKey: "EmployeeID" });

module.exports = {
  hrSequelize,  
  Sequelize,
  Department,
  Position,
  Employee,
  Dividend
};
