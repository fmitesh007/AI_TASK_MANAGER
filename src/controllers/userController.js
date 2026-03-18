const userSchema = require("../models/userModels");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await userSchema.create({
      email: email,
      password: password,
    });

    res.json({
      user,
      message: "User created",
    });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (userSchema.findOne(email))
    {

      }
  }
}

module.exports = { registerUser };
