const userSchema = require("../models/userModels");
const { generateOTP } = require("../utils/generateOTP.js");
const { sendOTP } = require("../utils/sendOTP.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await userSchema.findOne({ email })) {
      return res.json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWTSECERET);
    res.cookie("token", token);
    return res.json({
      message: "User created",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.json({ message: "User diest exist" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.json({ message: "Wrong password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWTSECERET);
    res.cookie("token", token);
    return res.json({
      message: "User signed in",
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);
    if (!user) return res.json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.log(err);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.json({ message: "user doesnt exist" });
    }
    const updates = { name, email };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await userSchema.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true },
    );
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWTSECRET);
    res.cookie("token", token);
    return res.json({
      message: "User updated",
      token,
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (!user) return res.json({ message: "User not found" });
    const otp = generateOTP();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 600000;
    await user.save();
    await sendOTP(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.json({ message: "Failed to send OTP" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  resetPassword,
};
