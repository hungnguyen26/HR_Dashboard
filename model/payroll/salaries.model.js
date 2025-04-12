module.exports = (sequelize, DataTypes) => {
    const Salary = sequelize.define("Salary", {
      SalaryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      EmployeeID: DataTypes.INTEGER,
      SalaryMonth: DataTypes.DATEONLY,
      BaseSalary: DataTypes.DECIMAL(12,2),
      Bonus: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0.00
      },
      Deductions: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0.00
      },
      NetSalary: DataTypes.DECIMAL(12,2),
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: "salaries",
      timestamps: false
    });
  
    return Salary;
  };
  