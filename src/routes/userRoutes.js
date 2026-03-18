const { registerUser } = require("../controllers/userController.js");
const express = require("express");
const userRouter = express.Router();
userRouter.post("/auth/register", registerUser);

module.exports = userRouter;
