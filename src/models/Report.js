const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview",
  },

  result: {
    type: String,
    enum: ["PASS", "FAIL", "OnHold", "Didn't Attempt"],
  },

  createdAt: {
    type: Date,
    default: Date(Date.now()),
  },
});

module.exports = mongoose.model("Report", reportSchema);
