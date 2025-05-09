module.exports = (authSequelize, DataTypes) => {
    const User = authSequelize.define(
      "User",
      {
        UserID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        PasswordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        Email: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        EmployeeID: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        CreatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        Token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        tableName: "Users",
        timestamps: false,
      }
    );
  
    return User;
  };
  