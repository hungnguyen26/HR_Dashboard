module.exports = (authSequelize, DataTypes) => {
    const Role = authSequelize.define(
      "Role",
      {
        RoleID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        RoleName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        tableName: "Roles",
        timestamps: false,
      }
    );
  
    return Role;
  };
  