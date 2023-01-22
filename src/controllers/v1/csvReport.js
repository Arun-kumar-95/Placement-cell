const path = require("path");
const studentSchema = require(path.join(
  process.cwd(),
  "./src/models/Student.js"
));
const fs = require("fs");

module.exports.ExcelJSReport = async (req, res) => {
  try {
    const arrayStudent = await studentSchema.find().populate([
      {
        path: "company",
        model: "Interview",
      },
      {
        path: "reports",
        model: "Report",
      },
    ]);
    let serialNumber = 1,
      entry = "";
    let fileData =
      "S.No, Name, Email, Batch, Status, DSA Score, WebD Score, React Score, Interview, Date, Result";
    for (student of arrayStudent) {
      entry =
        serialNumber +
        "," +
        student.name +
        "," +
        student.email +
        "," +
        student.batch +
        "," +
        student.status;

      if (student.score.length > 0) {
        for (score of student.score) {
          entry += "," + score.DSA + "," + score.WEB_DEV + "," + score.REACT;
        }
      }
      if (student.company.length > 0) {
        for (interview of student.company) {
          entry +=
            "," + interview.company + "," + interview.date.toDateString();
        }
      }

      if (student.reports.length > 0) {
        for (report of student.reports) {
          entry += "," + report.result;
        }
      }

      serialNumber++;

      fileData += "\n" + entry;
    }

    // write the file
    const file = fs.writeFile(
      "src/assets/data/student_record.csv",
      fileData,
      function (err, data) {
        if (err) {
          console.log(err);
          return res.redirect("back");
        }

        return res.download("src/assets/data/student_record.csv");
      }
    );
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
