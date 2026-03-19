const {
  createTask,
  displayAllTasks,
  displayTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");
const express = require("express");
const taskRouter = express.Router();

taskRouter.post("/tasks", createTask);
taskRouter.get("/tasks", displayAllTasks);
taskRouter.get("/tasks/:id", displayTaskById);
taskRouter.put("/tasks/:id", updateTask);
taskRouter.delete("/tasks/:id", deleteTask);

module.exports = taskRouter;
