module.exports = (authSequelize, DataTypes) => {
    const UserRole = authSequelize.define(
      "UserRole",
      {
        UserRoleID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        UserID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        RoleID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "UserRoles",
        timestamps: false,
      }
    );
  
    UserRole.associate = (models) => {
      UserRole.belongsTo(models.User, {
        foreignKey: "UserID",
        as: "user",
        onDelete: "CASCADE",
      });
  
      UserRole.belongsTo(models.Role, {
        foreignKey: "RoleID",
        as: "role",
        onDelete: "CASCADE",
      });
    };
  
    return UserRole;
  };
  