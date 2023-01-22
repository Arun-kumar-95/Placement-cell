const path = require("path");

const interviewSchema = require(path.join(
  process.cwd(),
  "./src/models/Interview.js"
));

module.exports.index = async (req, res) => {
  try {
    res.status(200).render("index", { title: "placement cell!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.register = async (req, res) => {
  try {
    res.status(200).render("register", { title: "Register" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.registerstudent = async (req, res) => {
  try {
    let user = req.user.name;
    const interviews = await interviewSchema.find().count();
    res.status(200).render("registerstudent", {
      title: "Register student",
      user,
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.otpPage = async (req, res) => {
  try {
    res.status(200).render("verifyOtp", {
      title: "Verify",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
