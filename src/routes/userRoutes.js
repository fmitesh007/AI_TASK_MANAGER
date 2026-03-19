const { registerUser, loginUser } = require("../controllers/userController.js");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/auth/register", registerUser);
userRouter.post("/auth/login", loginUser);

module.exports = userRouter;
