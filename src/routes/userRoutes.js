const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  resetPassword,
  uploadAvatar,
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

// Avatar-only upload — no body validation needed, just auth + upload middleware
userRouter.post(
  "/auth/avatar",
  auth,
  upload.single("avatar"),
  uploadAvatar,
);

// Profile update — text fields only, validated
userRouter.put(
  "/auth/profile/update",
  auth,
  validate(updateProfileSchemaZod),
  updateProfile,
);

userRouter.post("/auth/resetpassword", resetPassword);

module.exports = userRouter;
