const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otpText: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    createdAt: {
      type: Date,
      default: Date(Date.now()),
      index: { expires: 18000 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
