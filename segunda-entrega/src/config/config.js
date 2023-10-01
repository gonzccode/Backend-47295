const { config } = require("dotenv");

config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
  });

const { PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

module.exports = {
    PORT, DB_NAME, DB_USER, DB_PASSWORD
};