module.exports = (hrSequelize, DataTypes) => {
  const Department = hrSequelize.define(
    "Department",
    {
      DepartmentID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DepartmentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      CreatedAt: {
        type: DataTypes.DATE,
      },
      UpdatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "Departments",
      timestamps: false,
    }
  );

  return Department;
};
