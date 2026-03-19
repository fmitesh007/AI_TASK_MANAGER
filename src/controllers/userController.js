const userSchema = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await userSchema.findOne({ email })) {
      return res.json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
      email,
      password: hashedPassword,
    });

    return res.json({
      message: "User created",
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
    const token = jwt.sign({ email: user.email }, "shhhhh");
    return res.json({
      message: "User signed in",
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { registerUser, loginUser };
