const path = require("path");

const studentSchema = require(path.join(
  process.cwd(),
  "./src/models/Student.js"
));

const interviewSchema = require(path.join(
  process.cwd(),
  "./src/models/Interview.js"
));

const reportSchema = require(path.join(
  process.cwd(),
  "./src/models/Report.js"
));
const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/Utils/errorFormatter.js"
));

const { sendSms } = require(path.join(process.cwd(), "./src/Utils/sendSms.js"));

module.exports.getStudents = async (req, res) => {
  try {
    const students = await studentSchema.find({});
    const interviews = await interviewSchema.find().count();

    let user = req.user.name;
    res.status(200).render("allstudents", {
      title: "See All Students",
      user,
      interviews,
      data: [students],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

module.exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      college,
      email,
      phone,
      batch,
      dsascore,
      webdscore,
      reactscore,
      status,
    } = req.body;

    // find the student using email or phone
    let student = await studentSchema.findOne({ $or: [{ email }, { phone }] });

    // check if doctor already exists
    if (student) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    student = await studentSchema.create({
      name,
      age,
      phone,
      gender,
      email,
      college,
      batch,
      status,
      score: {
        DSA: dsascore,
        WEB_DEV: webdscore,
        REACT: reactscore,
      },
    });

    await student.save();
    res
      .status(201)
      .json({ success: true, message: "Student registered", data: [student] });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// filterStudent

module.exports.filterStudent = async (req, res) => {
  try {
    // find the student using name

    const { searchTxt } = req.body;
    const students = await studentSchema.find({
      name: { $regex: searchTxt, $options: "i" },
    });

    // if no studnt found then
    if (!students) {
      return res.status(400).json({
        success: false,
        message: "No Student Found",
      });
    }

    // if we found a student

    return res.status(200).json({
      success: true,
      TotalCount: students.length,
      message: "Student found",
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// DELETE STUDENT
module.exports.deleteStudent = async (req, res) => {
  try {
    // const id = req.params.id;
    const id = req.body.id;

    let match = [];
    let matchingReports = await reportSchema.find({ student: id });

    matchingReports.forEach((record) => {
      match.push(record._id);
    });

    // updating the match record to remove the results fiels from interviews
    let results = await interviewSchema
      .find({
        appliedStudents: id,
        results: { $in: match },
      })
      .updateMany(
        {},
        { $pull: { appliedStudents: id, results: { $in: match } } },
        { multi: true }
      );

    // remove all applied interviews
    await interviewSchema
      .find({ appliedStudents: id })
      .updateMany({}, { $pull: { appliedStudents: id } }, { multi: true });

    // remove all the matching reports of the student from reports
    reports = await reportSchema.deleteMany({ student: id });

    // remove the student
    await studentSchema.findByIdAndDelete({ _id: id });

    // send the response
    return res.status(200).json({
      success: true,
      message: "Student deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// update student

module.exports.getUpdateStudent = async (req, res) => {
  try {
    let user = req.user.name;
    const _id = req.params.id;

    // find the student based on id
    let student = await studentSchema.findById({ _id });
    const interviews = await interviewSchema.find().count();

    return res.status(200).render("updatestudent", {
      title: "Update student",
      user,
      interviews,
      data: [student],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

module.exports.updateStudent = async (req, res) => {
  try {
    const _id = req.params.id;

    const {
      name,
      age,
      gender,
      college,
      email,
      phone,
      batch,
      dsascore,
      webdscore,
      reactscore,
      status,
    } = req.body;

    const student = await studentSchema.findById(_id);
    if (student) {
      let updateStudent = await studentSchema.updateOne(
        { _id: _id },
        {
          $set: {
            name,
            age,
            phone,
            gender,
            email,
            college,
            batch,
            status,
            score: {
              DSA: dsascore,
              WEB_DEV: webdscore,
              REACT: reactscore,
            },
          },
        },
        {
          new: true,
          runvalidator: true,
          upsert: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Student updated",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// PROFILE

module.exports.profile = async (req, res) => {
  try {
    const username = req.params.name.split("=")[1];
    const _id = req.params.uid.split("=")[1];

    let user = req.user.name;
    const interviews = await interviewSchema.find().count();

    // get all the interviews by latest
    const interviewLists = await interviewSchema.find().sort({ createdAt: -1 });

    // get the student details based on id
    const student = await studentSchema.findById(_id).populate({
      path: "reports",
    });

    const studentReports = await reportSchema.find({ student: _id });

    // get all interviews based on student who had applied for
    const appliedInterviews = await interviewSchema
      .find({
        appliedStudents: _id,
      })
      .populate({
        path: "results",
        model: "Report",
      });

    const appliedInterviewData = {
      interviews: appliedInterviews,
      batch: student.batch,
      college: student.college,
      reports: studentReports,
    };

    const interviewData = {
      interviewLists,
      id: _id,
    };

    res.status(200).render("profile", {
      title: `Profile : ${username}`,
      user,
      interviews,
      _id,
      data: [appliedInterviewData, interviewData],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// profileHandlers

module.exports.profileHandlers = async (req, res) => {
  try {
    const { isApplied, isReport } = req.body;

    // APPLY FOR INTERVIEWS
    if (isApplied) {
      const { uid, companyId } = req.body;
      const student = await studentSchema.findById({ _id: uid });
      const interview = await interviewSchema.findById({ _id: companyId });

      // if no student found or ,interview found
      if (!student || !interview) {
        return res.status(404).json({
          success: false,
          message: "Invalid parameters",
        });
      }

      // if student exists then add interviews

      // find if student already applied then throw error
      const index = interview.appliedStudents.includes(uid);
      if (index) {
        return res.status(200).json({
          success: false,
          message: "Already Applied",
        });
      } else {
        await student.company.push(companyId);
        await interview.appliedStudents.push(student._id);

        await student.save();
        await interview.save();

        // CALLING THE SEND SMS HANDLER TO SEND SMD
        let phone = student.phone;
        let student_name = student.name;
        let company_name = interview.company;
        let role = interview.role;
        let date = interview.date.toDateString();
        let venue = interview.venue;

        sendSms(student_name, phone, company_name, role, date, venue);

        return res.status(200).json({
          success: true,
          message: "Interview Applied",
        });
      }
    }

    // CREATE REPORT

    if (isReport) {
      const { uid, companyId, status } = req.body;

      const student = await studentSchema.findById({ _id: uid });
      const interview = await interviewSchema.findById({ _id: companyId });

      // if no student found or ,interview found
      if (!student || !interview) {
        return res.status(404).json({
          success: false,
          message: "Invalid parameters",
        });
      }

      // create the report
      let report = await reportSchema.create({
        result: status,
        student: uid,
        company: companyId,
      });

      await report.save();

      let newReport = await reportSchema.findById(report._id);

      student.reports.push(newReport._id);
      interview.results.push(newReport._id);

      // Saving the doc
      await student.save();
      await report.save();
      await interview.save();

      return res.status(201).json({
        success: true,
        message: "Report Created",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
