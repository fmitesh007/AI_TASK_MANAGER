const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  resetPassword,
} = require("../controllers/userController.js");
const express = require("express");
const validate = require("../middleware/validate.js");
const auth = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");
const { userSchemaZod, updateProfileSchemaZod } = require("../utils/validators.js");
const userRouter = express.Router();

userRouter.post("/auth/register", validate(userSchemaZod), registerUser);
userRouter.post("/auth/login", validate(userSchemaZod), loginUser);
userRouter.post("/auth/logout", logoutUser);
userRouter.get("/auth/profile", auth, getProfile);

userRouter.put(
  "/auth/profile/update",
  auth,
  validate(updateProfileSchemaZod),
  upload.single("avatar"),
  updateProfile,
);

userRouter.post("/auth/resetpassword", resetPassword);

module.exports = userRouter;
