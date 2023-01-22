const express = require("express");
const router = express.Router();

const { index, register, otpPage } = require("../../controllers/v1/main.js");

const { dashboard, notify } = require("../../controllers/v1/dashboard.js");
const {
  loginEmployee,
  registerEmployee,
  verifyEmployee,
} = require("../../controllers/v1/employee.js");

const { isAuthenticated } = require("../../middlewares/auth.js");

router.route("/register").get(register).post(registerEmployee);
router.route("/").get(index).post(loginEmployee);

router.route("/verify").get(otpPage).post(verifyEmployee);

router.route("/dashboard").get(isAuthenticated, dashboard).post(notify);
module.exports = router;
