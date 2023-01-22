const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["Please enter your full name", true],
    match: [/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter valid name"],
  },
  age: {
    type: Number,
    required: [true, "Enter age"],
  },
  gender: {
    type: String,
    required: [true, "Select Gender"],
  },

  phone: {
    type: Number,
    required: [true, "Enter phone number"],
    min: [11, "Enter valid phone number"],
  },
  email: {
    type: String,
    required: ["Please enter your email address", true],
    unique: ["Email already taken", true],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: ["Enter your password", true],
    select: false,
    minLength: [6, "Password must be of 6 character"],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// METHODS

employeeSchema.pre("save", async function (next) {
  // create the salt
  let salt = await bcrypt.genSalt(10);
  // modify password field only is password field is changed
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// matchPassword
employeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate token

employeeSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

employeeSchema.methods.generateOTPText = async function () {
  const otp = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};
module.exports = mongoose.model("Employee", employeeSchema);
