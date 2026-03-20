const taskSchema = require("../models/taskModels");
const model = require("../ai/ai.service.js");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await taskSchema.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userID: req.user,
    });
    return res.json({
      message: "task created",
      task,
    });
  } catch (err) {
    console.log(err);
  }
};

const displayAllTasks = async (req, res) => {
  try {
    const tasks = await taskSchema.find();
    return res.json({
      message: "displaying all tasks",
      tasks,
    });
  } catch (err) {
    console.log(err);
  }
};

const displayUserTasks = async (req, res) => {
  try {
    const tasks = await taskSchema.find({ userID: req.user });
    if (!tasks) {
      return res.json({
        message: "no tasks found for ths user",
      });
    }
    return res.json({
      message: "listing task by user ID",
      tasks,
    });
  } catch (err) {
    return console.log(err);
  }
};

const displayTaskById = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({
        message: "No task for this ID",
      });
    }
    return res.json({
      message: "displaying task by ID",
      task,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskSchema.findByIdAndUpdate(req.params.id, req.body);
    if (!task) {
      return res.json({
        message: "Task not found",
      });
    }
    const updatedTask = await taskSchema.findById(req.params.id);
    return res.json({
      message: "Task updated",
      updatedTask,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await taskSchema.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.json({
        message: "Task not found",
      });
    }
    return res.json({
      message: "Task Deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

const summarize = async (req, res) => {
  try {
    const tasks = await taskSchema.find({ userID: req.user });
    const genModel = model();
    const result = await genModel.generateContent(
      `you are a task summerizing AI your main work is to summerize all the task listed and give a simpified summery of them in 5 lines tasks :${tasks}`,
    );

    console.log(tasks);
    return res.json({ message: result.response.text() });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createTask,
  displayAllTasks,
  displayUserTasks,
  displayTaskById,
  updateTask,
  deleteTask,
  // generateSubtasks,
  // rewrite,
  // estimate,
  summarize,
};
