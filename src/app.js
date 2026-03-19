const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes.js");
const taskRouter = require("./routes/taskroutes.js");
const { connectDB } = require("./db/db.js");
require("dotenv").config();
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "dummy route" });
});

app.use("/api", userRouter);
app.use("/api", taskRouter);

app.listen(8000, () => {
  console.log("server running at 8000");
});
