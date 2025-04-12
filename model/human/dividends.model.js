module.exports = (sequelize, DataTypes) => {
  const Dividend = sequelize.define(
    "Dividend",
    {
      DividendID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      EmployeeID: DataTypes.INTEGER,
      DividendAmount: DataTypes.DECIMAL(12, 2),
      DividendDate: DataTypes.DATEONLY,
      CreatedAt: DataTypes.DATE,
    },
    {
      tableName: "Dividends",
      timestamps: false,
    }
  );

  return Dividend;
};
