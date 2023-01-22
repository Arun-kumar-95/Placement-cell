const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth.js");

const { registerstudent } = require("../../controllers/v1/main.js");

const {
  interviews,
  renderInterview,
  createInterview,
  deleteInterview,
} = require("../../controllers/v1/interview.js");

const {
  registerStudent,
  getStudents,
  filterStudent,
  deleteStudent,
  getUpdateStudent,
  updateStudent,
  profile,
  profileHandlers,
} = require("../../controllers/v1/student.js");

const { logout } = require("../../controllers/v1/employee.js");
const { manage } = require("../../controllers/v1/dashboard.js");
const { ExcelJSReport } = require("../../controllers/v1/csvReport.js");

router.route("/manage").get(isAuthenticated, manage);
router
  .route("/registerstudent")
  .get(isAuthenticated, registerstudent)
  .post(registerStudent);

router
  .route("/allstudents")
  .get(isAuthenticated, getStudents)
  .post(filterStudent);

router.route("/allstudents/:id").post(isAuthenticated, deleteStudent);

router
  .route("/registerstudent/:id")
  .get(isAuthenticated, getUpdateStudent)
  .post(isAuthenticated, updateStudent);

router
  .route("/createinterview")
  .get(isAuthenticated, renderInterview)
  .post(isAuthenticated, createInterview);

router.route("/interviews").get(isAuthenticated, interviews);
router.route("/interviews/:id").post(isAuthenticated, deleteInterview);

router
  .route("/profile/:uid&:name")
  .get(isAuthenticated, profile)
  .post(isAuthenticated, profileHandlers);

router.route("/generate").get(isAuthenticated, ExcelJSReport);
router.route("/logout").post(isAuthenticated, logout);

module.exports = router;
