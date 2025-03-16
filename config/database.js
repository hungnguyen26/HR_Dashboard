const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Kết nối Payroll System (MySQL)
const payrollSequelize = new Sequelize(
  process.env.PAYROLL_DB_NAME,
  process.env.PAYROLL_DB_USER,
  process.env.PAYROLL_DB_PASS,
  {
    host: process.env.PAYROLL_DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Kết nối HR System (SQL Server)
const hrSequelize = new Sequelize(
  process.env.HR_DB_NAME,
  process.env.HR_DB_USER,
  process.env.HR_DB_PASS,
  {
    host: process.env.HR_DB_HOST,
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);


const connectDB = async () => {
  try {
    await payrollSequelize.authenticate();
    console.log("✅ Connected to Payroll System (MySQL) successfully.");

    await hrSequelize.authenticate();
    console.log("✅ Connected to HR System (SQL Server) successfully.");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};


module.exports = {
  payrollSequelize,
  hrSequelize,
  connectDB,
};
