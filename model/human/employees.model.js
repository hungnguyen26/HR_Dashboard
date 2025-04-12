module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      EmployeeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      FullName: DataTypes.STRING(100),
      DateOfBirth: DataTypes.DATEONLY,
      Gender: DataTypes.STRING(10),
      PhoneNumber: DataTypes.STRING(15),
      Email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      HireDate: DataTypes.DATEONLY,
      DepartmentID: DataTypes.INTEGER,
      PositionID: DataTypes.INTEGER,
      Status: DataTypes.STRING(50),
      CreatedAt: DataTypes.DATE,
      UpdatedAt: DataTypes.DATE,
    },
    {
      tableName: "Employees",
      timestamps: false,
    }
  );

  return Employee;
};
