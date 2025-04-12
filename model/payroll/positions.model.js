module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define("Position", {
      PositionID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      PositionName: DataTypes.STRING(100)
    }, {
      tableName: "positions",
      timestamps: false
    });
  
    return Position;
  };
  