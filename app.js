const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./src/routes/userRoutes.js");
const taskRouter = require("./src/routes/taskRoutes.js");
const { connectDB } = require("./src/db/db.js");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;
require("dotenv").config();
connectDB();

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "https://ai-task-manager-7ax0.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
