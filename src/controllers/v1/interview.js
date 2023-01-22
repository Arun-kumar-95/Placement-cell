const path = require("path");

const interviewSchema = require(path.join(
  process.cwd(),
  "./src/models/Interview.js"
));
const studentSchema = require(path.join(
  process.cwd(),
  "./src/models/Student.js"
));
const reportSchema = require(path.join(
  process.cwd(),
  "./src/models/Report.js"
));

const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/Utils/errorFormatter.js"
));
// RENDER INTERVIEW PAGE

module.exports.renderInterview = async (req, res) => {
  try {
    let user = req.user.name;
    const interviews = await interviewSchema.find().count();

    res.status(200).render("createinterview", {
      title: "Create Interview",
      user,
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// CREATE INTERVIEW
module.exports.createInterview = async (req, res) => {
  try {
    const { company, role, date, venue } = req.body;
    if ((!company || !role || !date, !venue)) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    let interview = await interviewSchema.create({
      company,
      role,
      date,
      venue,
    });

    await interview.save();
    return res.status(201).json({
      success: true,
      message: "Interview created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// ALL INTERVIEWS
module.exports.interviews = async (req, res) => {
  try {
    let user = req.user.name;
    const interviews = await interviewSchema.find().count();

    // const interviews = await interviewSchema.find();
    const allinterviews = await interviewSchema
      .find()
      .populate([
        {
          path: "appliedStudents",
          model: "Student",
        },
        {
          path: "results",
          model: "Report",
        },
      ])
      .sort({ createdAt: -1 });

    res.status(200).render("allinterviews", {
      title: "All Interviews",
      user,
      interviews,
      data: [allinterviews],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// DELETE INTERVIEW

module.exports.deleteInterview = async (req, res) => {
  try {
    const id = req.body.id;

    let match = [];
    let matchingReports = await reportSchema.find({ company: id });

    matchingReports.forEach((record) => {
      match.push(record._id);
    });

    // updating the match record to remove the results fiels from interviews
    let results = await studentSchema
      .find({
        reports: { $in: match },
      })
      .updateMany({}, { $pull: { reports: { $in: match } } }, { multi: true });

    await studentSchema
      .find({ company: id })
      .updateMany({}, { $pull: { company: id } }, { multi: true });

    // remove all the matching reports of that company
    reports = await reportSchema.deleteMany({ company: id });

    // delete the interview
    interview = await interviewSchema.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Interview deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
