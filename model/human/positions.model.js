module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define("Position", {
      PositionID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PositionName: {
        type: DataTypes.STRING(100),
      },
      CreatedAt: {
        type: DataTypes.DATE,
      },
      UpdatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: "Positions",
      timestamps: false
    });
  
    return Position;
  };
  