module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
      EmployeeID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      FullName: DataTypes.STRING(100),
      DepartmentID: DataTypes.INTEGER,
      PositionID: DataTypes.INTEGER,
      Status: DataTypes.STRING(50)
    }, {
      tableName: "employees",
      timestamps: false
    });
  
    return Employee;
  };
  