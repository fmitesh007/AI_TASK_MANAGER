const {
  createTask,
  displayAllTasks,
  displayUserTasks,
  displayTaskById,
  updateTask,
  deleteTask,
  generateSubtasks,
  rewrite,
  estimate,
  summarize,
} = require("../controllers/taskController.js");
const express = require("express");
const auth = require("../middleware/auth.js");
const validate = require("../middleware/validate");
const { taskSchemaZod } = require("../utils/validators");

const taskRouter = express.Router();

taskRouter.post("/user/tasks", auth, validate(taskSchemaZod), createTask);
taskRouter.get("/alltasks", auth, displayAllTasks);
taskRouter.get("/user/tasks", auth, displayUserTasks);
taskRouter.get("/user/tasks/:id", auth, displayTaskById);
taskRouter.put(
  "/user/tasks/:id",
  auth,
  validate(taskSchemaZod.partial()),
  updateTask,
);
taskRouter.delete("/user/tasks/:id", auth, deleteTask);

taskRouter.get("/tasks/:id/generate-subtasks", generateSubtasks);
taskRouter.get("/tasks/:id/rewrite", rewrite);
taskRouter.get("/tasks/:id/estimate", estimate);
taskRouter.get("/tasks/summary", auth, summarize);

module.exports = taskRouter;
