const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController.js");
const express = require("express");
const validate = require("../middleware/validate.js");
const { userSchemaZod } = require("../utils/validators.js");
const userRouter = express.Router();

userRouter.post("/auth/register", validate(userSchemaZod), registerUser);
userRouter.post("/auth/login", validate(userSchemaZod), loginUser);
userRouter.post("/auth/logout", logoutUser);

module.exports = userRouter;
