const { config } = require("dotenv");

config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
  });

const { NODE_ENV, PORT, DB_NAME, DB_USER, DB_PASSWORD, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

module.exports = {
  NODE_ENV, PORT, DB_NAME, DB_USER, DB_PASSWORD, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
};