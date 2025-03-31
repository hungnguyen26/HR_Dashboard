const homeRouter = require("./home.router");
const employeeRouter = require("./employees.router");
const payrollRouter = require("./payroll.router");
const reportRouter = require("./reports.router");
const departmentRouter = require("./departments.router");
const jobRouter = require("./jobs.router");

module.exports = (app) => {
  app.use("/", homeRouter);

  app.use("/home", homeRouter);

  app.use("/employees", employeeRouter);

  app.use("/payroll", payrollRouter);

  app.use("/reports", reportRouter);

  app.use("/departments", departmentRouter);

  app.use("/jobs", jobRouter);

};
