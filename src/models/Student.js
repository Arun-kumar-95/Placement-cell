const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter full name"],
    lowercase: true,
    match: [/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter valid name"],
  },
  age: {
    type: Number,
    min: [19, "Opps you age is not valid"],
  },
  phone: {
    type: Number,
    min: [11, "Enter valid phone number"],
    trim: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Select gender"],
  },

  email: {
    type: String,
    required: [true, "Enter email address"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  batch: {
    type: String,
    required: [true, "Enter batch details"],
  },
  college: {
    type: String,
    lowercase: true,
    minLength: [10, "Enter valid college name"],
  },

  status: {
    type: String,
    enum: ["Placed", "Not-Placed"],
    required: [true, "Select status"],
  },

  score: [],

  // result holds company interview result one to one relationship
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],

  // this will be an array of companies as it will has one to many relationships
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
  ],

  createdAt: {
    type: Date,
    default: Date(Date.now()),
  },
});

module.exports = mongoose.model("Student", studentSchema);
