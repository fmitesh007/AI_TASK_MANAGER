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
    const sumUpPrompt = `You are a task summarization AI.
      Your job is to analyze a list of tasks and generate a concise,
      clear summary in exactly 5 lines. Focus on priority, deadlines, status,
      and overall workload. Use simple language and highlight urgent or overdue items.
      Do not add extra details or formatting tasks :${tasks}`;
    const result = await genModel.generateContent(sumUpPrompt);

    console.log(tasks);
    return res.json({ message: result.response.text() });
  } catch (err) {
    console.log(err);
  }
};

const generateSubtasks = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({
        message: "No task for this ID",
      });
    }
    const genModel = model();
    const subTaskPrompt = `You are a Task Decomposition Tool. Given a single JSON task object as input, output only JSON with a top-level key "subtasks" mapping to an array of 4–8 subtask objects that break the task into clear, ordered, actionable steps. Follow these rules:
    Use fields title, description, status, priority, dueDate, createdAt, userID to tailor subtasks.
    Each subtask object must include:
    "id": short unique string (e.g., "s1", "s2", ...).
    "title": concise action (max 8 words).
    "description": 1–2 sentences describing the action and expected deliverable.
    "estimate_minutes": integer minutes to complete.
    "depends_on": array of ids this subtask depends on (empty array if none).
    "dueDate": ISO 8601 datetime string in UTC if main task has dueDate; otherwise null. Distribute subtask dueDates so final ones finish on or before the main dueDate.
    "priority": inherit main task priority unless a subtask needs higher urgency.
    If status is not "TODO", add a leading subtask reflecting current state (e.g., "Continue work").
    If description lacks detail, include an early "Clarify requirements" subtask (30–90 minutes).
    Create subtasks covering planning, drafting, review, revision, and submission (or equivalents) with logical dependencies and no cycles.
    Estimates: small tasks 15–60 minutes, larger 120–360 minutes.
    Convert input dueDate (format DD/MM/YYYY) to ISO 8601 UTC datetimes; assume user's timezone is UTC.
    Output must be minimal JSON only—no extra keys, comments, or explanatory text.
    Keep language neutral and actionable. this is the task youll break down ${task}`;
    const result = await genModel.generateContent(subTaskPrompt);
    return res.json({ message: result.response.text() });
  } catch (err) {
    console.log(err);
  }
};

const rewrite = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({
        message: "No task for this ID",
      });
    }
    const genModel = model();
    const rewritePrompt = `You are a Task Rewriting Tool. Given a single JSON task object as input, output only JSON with a top-level key "task" mapping to an improved, clearer, and tangentially better version of the original task. Follow these rules:
    Use fields title, description, status, priority, dueDate, createdAt, userID to rewrite and enhance the task.
    Preserve the original intent but improve clarity, specificity, and actionability; add one or two useful tangential enhancements (e.g., success criteria, suggested deliverables, preferred format, or key stakeholders).
    Output fields for the rewritten task object:
    "_id": preserve original _id.
    "title": concise, action-oriented (≤8 words).
    "description": 1–3 sentences that clarify scope, deliverables, and any assumptions.
    "status": preserve original status.
    "priority": preserve or upgrade if enhancement requires higher urgency.
    "dueDate": convert DD/MM/YYYY to ISO 8601 date string in UTC; if missing, set null_
    "userID": preserve original userID.
    "createdAt" and "updatedAt": set to ISO 8601 UTC datetimes; preserve createdAt if present, set updatedAt to current datetime (2026-03-21T00:00:00Z).
    "metadata": object with optional keys: "success_criteria" (array of short strings), "suggested_format" (string), "stakeholders" (array of short strings). Include only keys you add.
    Keep additions realistic and minimal—no more than two tangential enhancements.
    Do not add any keys beyond those listed.
    Output must be valid JSON only—no extra text or commentary._ this is the input task: ${task}`;
    const result = await genModel.generateContent(rewritePrompt);
    return res.json({ message: result.response.text() });
  } catch (err) {
    console.log(err);
  }
};

const estimate = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({
        message: "No task for this ID",
      });
    }
    const genModel = model();
    const estimatePrompt = `You are a Task Complexity Analyzer. Given a single JSON task object as input, output only JSON with a top-level key "analysis" mapping to an object that assesses complexity and provides time estimates. Follow these rules:

    Use fields title, description, status, priority, dueDate, createdAt, userID to inform the analysis.
    Provide these keys inside "analysis":
    "complexity_level": one of "Very Low", "Low", "Medium", "High", "Very High".
    "confidence": integer percentage (30–100) representing confidence in the assessment.
    "estimated_total_minutes": integer total minutes to complete the task.
    "breakdown": array of objects detailing major effort components; each object must include:
    "name": short label (e.g., "Research", "Drafting", "Review").
    "minutes": integer minutes allocated.
    "notes": 1–2 short sentences explaining scope of that component.
    "critical_risks": array of short strings listing up to 5 risks that could increase time or block completion.
    "assumptions": array of short strings listing up to 5 assumptions made to produce the estimate.
    Estimates should be realistic and consistent: sum of "breakdown" minutes must equal "estimated_total_minutes".
    If description lacks detail, include assumption items reflecting unknowns and allocate a "Clarification" component (30–90 minutes).
    If status is not "TODO", adjust estimates to reflect remaining work (do not assume task is complete).
    If dueDate exists, indicate in "assumptions" whether the deadline is feasible given the estimate.
    Keep output minimal and strictly valid JSON—no extra keys, comments, or text.this is the input task: ${task}`;
    const result = await genModel.generateContent(estimatePrompt);
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
  generateSubtasks,
  rewrite,
  estimate,
  summarize,
};
