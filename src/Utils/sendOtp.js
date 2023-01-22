const twilio = require("twilio");
module.exports.sendOTP = (PHONE, OTP) => {
  const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages
    .create({
      body: `Your Otp is :${OTP}. which expires in 5 min`,
      from: process.env.TWILIO_PHONE,
      to: `+91${PHONE}`,
    })
    .then((message) => console.log("Otp sends"))
    .catch((err) => console.log(err, "Otp not send"));
};
