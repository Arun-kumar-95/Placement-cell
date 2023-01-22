const twilio = require("twilio");

module.exports.sendSms = (NAME, PHONE, COMPANY_NAME, ROLE, DATE, VENUE) => {
  const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages
    .create({
      body: `Congratulations ${NAME}. Your interview has been scheduled on ${DATE} for ${ROLE} at ${VENUE} for ${COMPANY_NAME}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${PHONE}`,
    })
    .then((message) => console.log("message sends"))
    .catch((err) => console.log(err, "message not send"));
};
