const path = require("path");

const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

const studentSchema = require(path.join(
  process.cwd(),
  "./src/models/Student.js"
));
const interviewSchema = require(path.join(
  process.cwd(),
  "./src/models/Interview.js"
));
const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/Utils/errorFormatter.js"
));

// RENDER DASHBOARD
module.exports.dashboard = async (req, res) => {
  try {
    let user = req.user.name;
    const interviews = await interviewSchema.find().count();
    const employees = await employeeSchema.find().count();
    const students = await studentSchema.find().count();

    res.status(200).render("dashboard", {
      title: "Dashboard",
      user,
      employees,
      students,
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// show notification
module.exports.notify = async (req, res) => {
  try {
    const { isNotify } = req.body;

    if (isNotify) {
      const interviews = await interviewSchema.find().sort({ date: -1 });

      // GET THE CURRENT TIME
      let currentDate = new Date().toJSON().slice(0, 10);
      // FILTER THE INTERVIEW BASED ON DATE
      const expiredInterview = await interviewSchema.find({
        date: { $lt: new Date(currentDate) },
      });

      return res.status(200).json({
        success: true,
        message: "Notification",
        data: [interviews, expiredInterview],
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// RENDER MANAGE
module.exports.manage = async (req, res) => {
  try {
    let user = req.user.name;
    const interviews = await interviewSchema.find().count();

    res.status(200).render("manage", { title: "Manage", user, interviews });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
