const {
  createTask,
  displayAllTasks,
  displayUserTasks,
  displayTaskById,
  updateTask,
  deleteTask,
  // generateSubtasks,
  // rewrite,
  // estimate,
  // summarize,
} = require("../controllers/taskController.js");
const express = require("express");
const auth = require("../middleware/auth.js");

const taskRouter = express.Router();

taskRouter.post("/user/tasks", auth, createTask);
taskRouter.get("/alltasks", auth, displayAllTasks);
taskRouter.get("/user/tasks", auth, displayUserTasks);
taskRouter.get("/user/tasks/:id", auth, displayTaskById);
taskRouter.put("/user/tasks/:id", auth, updateTask);
taskRouter.delete("/user/tasks/:id", auth, deleteTask);

// taskRouter.post("/tasks/:id/generate-subtasks", generateSubtasks);
// taskRouter.post("/tasks/:id/rewrite", rewrite);
// taskRouter.post("/tasks/:id/estimate", estimate);
// taskRouter.get("/tasks/summary", summarize);

module.exports = taskRouter;
