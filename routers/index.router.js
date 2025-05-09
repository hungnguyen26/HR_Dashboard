const homeRouter = require("./home.router");
const employeeRouter = require("./employees.router");
const payrollRouter = require("./payroll.router");
const reportRouter = require("./reports.router");
const departmentRouter = require("./departments.router");
const jobRouter = require("./jobs.router");
const attendanceRouter = require("./attendance.router");
const authRouter = require("./auth.router");
const acRouter = require("./account.router");
const authMiddlewares = require("../middleware/auth.middlewares");

const authControllers = require("../controllers/auth.controller")

module.exports = (app) => {
  
  app.get("/", authControllers.login);

  app.use("/home", authMiddlewares.requireAuth, homeRouter);

  app.use("/employees", authMiddlewares.requireAuth , employeeRouter);

  app.use("/payroll", authMiddlewares.requireAuth, payrollRouter);

  app.use("/reports", authMiddlewares.requireAuth, reportRouter);

  app.use("/departments", authMiddlewares.requireAuth, departmentRouter);

  app.use("/jobs", authMiddlewares.requireAuth, jobRouter);

  app.use("/attendance", authMiddlewares.requireAuth, attendanceRouter);

  app.use("/auth", authRouter);

  app.use("/account", authMiddlewares.requireAuth, acRouter);

};
