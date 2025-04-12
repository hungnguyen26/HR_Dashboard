module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      AttendanceID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      EmployeeID: DataTypes.INTEGER,
      WorkDays: DataTypes.INTEGER,
      AbsentDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      LeaveDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      AttendanceMonth: DataTypes.DATEONLY,
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "attendance",
      timestamps: false,
    }
  );

  return Attendance;
};
