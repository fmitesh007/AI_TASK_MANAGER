const taskSchema = require("../models/taskModels");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, userID } = req.body;
    const task = await taskSchema.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userID,
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

// const updateTask = async (req, res) => {
//   try {
//     const { title, description, status, priority, dueDate, userID } = req.body;
//     const istask = await taskSchema.findById(req.params.id);
//     if (!istask) {
//       return res.json({
//         message: "No task for this ID",
//       });
//     }
//     const task = new taskSchema({
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       userID,
//     });
//     await task.save();
//     return res.json({
//       message: "task updated",
//       task,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

const updateTask = async (req, res) => {
  try {
    const task = await taskSchema.findByIdAndUpdate(req.params.id, req.body);
    if (!task) {
      return res.json({
        message: "Task not found",
      });
    }
    return res.json({
      message: "Task updated",
      task,
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

module.exports = {
  createTask,
  displayAllTasks,
  displayTaskById,
  updateTask,
  deleteTask,
};
