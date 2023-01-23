const path = require("path");
const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

const otpSchema = require(path.join(process.cwd(), "./src/models/Otp.js"));

const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/Utils/errorFormatter.js"
));

const { sendOTP } = require(path.join(process.cwd(), "./src/Utils/sendOtp.js"));

const bcrypt = require("bcrypt");

// REGISTER
module.exports.registerEmployee = async (req, res) => {
  try {
    const { name, age, gender, phone, email, password } = req.body;

    if ((!name || !age || !gender || !phone || !email, !password)) {
      return res.status(404).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // check if employee already exists
    let user = await employeeSchema.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "Employee already exists",
      });
    }

    // create a employee
    user = await employeeSchema.create({
      name,
      age,
      phone,
      gender,
      email,
      password,
    });

    await user.save();

    res.status(201).json({ success: true, message: "You are registered now" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// LOGIN
module.exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find doctor by username
    let user = await employeeSchema.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesnot exists",
      });
    }

    // if we found the doctor then check for password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // generate otp text
    const otp = await user.generateOTPText();

    // hash the otp
    const hashedOtp = await bcrypt.hash(otp, 10);
    // create an opt
    let otpDoc = await otpSchema.create({
      phone: user.phone,
      otpText: hashedOtp,
    });

    await otpDoc.save();
    // send the otp
    sendOTP(user.phone, otp);

    // making use of cookies
    res.cookie("emp_ph", user.phone, {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Otp send,verify yourself",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// verify employee
module.exports.verifyEmployee = async (req, res) => {
  try {
    const { otp } = req.body;

    //  find the otp doc for the
    let otpHolder = await otpSchema.findOne({
      phone: req.cookies.emp_ph,
    });

    if (!otpHolder) {
      return res.status(404).cookie("emp_ph", null).json({
        success: false,
        message: "Otp Expired, login again !",
      });
    }

    const isMatch = await bcrypt.compare(otp, otpHolder.otpText);

    if (isMatch) {
      // find the user using phone number
      const phone = req.cookies.emp_ph;
      const user = await employeeSchema.findOne({ phone });
      // generate the token
      const token = await user.generateToken();
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.status(200).cookie("token", token, options).json({
        success: true,
        message: "You are now authenticated",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// logout
module.exports.logout = async function (req, res) {
  try {
    const { isLoggedOut } = req.body;

    if (isLoggedOut) {
      let options = {
        expires: new Date(Date.now()),
        httpOnly: true,
      };

      return res.status(200).cookie("token", null, options).json({
        success: true,
        message: "You are logged out",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
