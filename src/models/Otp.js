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

    createdAt: {
      type: Date,
      default: Date.now(),
      index: { expires: 60 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
