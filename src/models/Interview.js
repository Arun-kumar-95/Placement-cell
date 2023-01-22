const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema({
  company: {
    type: String,
    enum: [
      "Tata Consultancy Services (TCS)",
      "Accenture",
      "Cognizant",
      "Infosys",
      "Capgemini",
      "Wipro",
      "IBM",
      "HCL Technologies",
      "Larsen and Toubro",
      "Deloitte",
    ],
  },

  role: {
    type: String,
    enum: [
      "Software engineer",
      "Business analyst",
      "Sales representative",
      "Marketing manager",
      "Product manager",
      "Human resource (HR)",
      "Front-end Role",
      "Back-end Role",
      "Nodejs Developer",
      "React Developer",
    ],
  },

  date: {
    type: Date,
    required: [true, "Select date"],
  },

  venue: {
    type: String,
    required: [true, "Write venue"],
  },

  // we store the id of the many students

  appliedStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],

  results: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],

  createdAt: {
    type: Date,
    default: Date(Date.now),
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
