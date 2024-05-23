const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize("HikingDB", "sa", "Halil007", {
//   host: "localhost",
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false, // Set to true if you are using Azure
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
      },
    },
    server: process.env.DB_HOST,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
