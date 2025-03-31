const homeRouter = require("./home.router");
const employeeRouter = require("./employees.router");
const payrollRouter = require("./payroll.router");
const reportRouter = require("./reports.router");

module.exports = (app) => {
  app.use("/", homeRouter);

  app.use("/home", homeRouter);

  app.use("/employees", employeeRouter);

  app.use("/payroll", payrollRouter);

  app.use("/reports", reportRouter);
};
