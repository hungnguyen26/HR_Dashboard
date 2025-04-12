module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define("Department", {
      DepartmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      DepartmentName: DataTypes.STRING(100)
    }, {
      tableName: "departments",
      timestamps: false
    });
  
    return Department;
  };
  