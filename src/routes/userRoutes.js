const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController.js");
const express = require("express");
const validate = require("../middleware/validate.js");
const auth = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");
const { userSchemaZod } = require("../utils/validators.js");
const userRouter = express.Router();

userRouter.post("/auth/register", validate(userSchemaZod), registerUser);
userRouter.post("/auth/login", validate(userSchemaZod), loginUser);
userRouter.post("/auth/logout", logoutUser);
userRouter.get("/auth/profile", auth, getProfile);

userRouter.put(
  "/auth/profile/update",
  auth,
  validate(userSchemaZod),
  upload.single("avatar"),
  updateProfile,
);

module.exports = userRouter;
