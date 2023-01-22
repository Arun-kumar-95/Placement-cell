const express = require("express");
const app = express();
const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/configs/config.env" });
}
const { connect } = require("../configs/config.db.js");

if (connect(process.env.DATABASE_URL)) {
  // connect the server if we have database connected
  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
}

module.exports = app;
