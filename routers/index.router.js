const homeRouter = require("./home.router");
const employeeRouter = require("./employees.router");

module.exports = (app) => {
  app.use("/home", homeRouter);

  app.use("/employees", employeeRouter);
};
