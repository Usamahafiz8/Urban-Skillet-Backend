const mongoose = require("mongoose");

require("dotenv").config();
const db_url = process.env.DB;

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log("Error: " + error);
  });

module.exports = mongoose;
