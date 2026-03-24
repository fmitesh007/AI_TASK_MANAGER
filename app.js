const express = require("express");
const app = express();
const userRouter = require("./src/routes/userRoutes.js");
const taskRouter = require("./src/routes/taskRoutes.js");
const { connectDB } = require("./src/db/db.js");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;
require("dotenv").config();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "dummy route" });
});

app.use("/api", userRouter);
app.use("/api", taskRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
