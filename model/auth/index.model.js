const { authSequelize } = require("../../config/database");
const Sequelize = require("sequelize");

const Role = require("./roles.model")(authSequelize, Sequelize.DataTypes);
const User = require("./users.model")(authSequelize, Sequelize.DataTypes);
const UserRole = require("./userRoles.model")(authSequelize, Sequelize.DataTypes);

User.belongsToMany(Role, { through: UserRole, foreignKey: "UserID" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "RoleID" });

module.exports = {
  authSequelize,
  Sequelize,
  Role,
  User,
  UserRole,
};
