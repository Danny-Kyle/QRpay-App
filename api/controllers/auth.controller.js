import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details for User Registration",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists on Database",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPass });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to CalebEats",
      text: `Welcome and thank you for choosing to use CalebEats Platform. Your account has been created successfully with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please provide the correct email and password",
    });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res, json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId  = req.userId;

    if(!userId){
      return res.json({ success: false, message: "Authentication required (userID missing)"})
    }

    const user = await UserModel.findById(userId);

    if(!user){
      return res.json({
        success: false,
        message: "User not found in database"
      })
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "User Account already Verified",
      });
    }

    const otp = String(Math.floor(10000 + Math.random() * 90000));

    user.verifyOtp = otp;

    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP(One-Time Password)",
      text: `Your OTP(One-Time Password) is ${otp}. Please proceed to verify your account using this OTP(One-Time Password)`,
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: "Verification OTP sent to User's Email",
    });
  } catch (error) {
    console.error("Error in sendVerifyOTp:", error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;
  console.log('Received request for verifyEmail:');
  console.log('req.body:', req.body);
  console.log('req.body.userId:', req.body ? req.body.userId : 'req.body is undefined');
  console.log('req.body.otp:', req.body ? req.body.otp : 'req.body is undefined');

  if (!userId || !otp) {
    console.log('Missing userId or otp. userId:', userId, 'otp:', otp); // Log values if they are missing
    return res.status(400).json({ success: false, message: "Missing User ID or OTP in request." });
  }
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpiredAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiredAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email Successfully Verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Valid Email Required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(10000 + Math.random() * 90000));

    user.resetOtp = otp;

    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP(One-Time Password)",
      text: `Your OTP(One-Time Password) is ${otp}. Please proceed to reset your account password using this OTP(One-Time Password)`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Password Reset OTP sent to Email ",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP and New Password are Required!!",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiredAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiredAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password Successfully reset" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
