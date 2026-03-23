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
          Do not add extra details or formatting tasks: ${JSON.stringify(tasks)} example output :
          {
            "summary": "You have 3 tasks in total, all pending.
            All tasks are low priority. Workload includes proposal, PRs, and AI demo."
          }
          `;
    const result = await genModel.generateContent({
      contents: [{ parts: [{ text: sumUpPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    const text = result.response.text().trim();
    const cleanedText = text.replace(/^```json\n?|```$/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    const summaryString = parsed.summary.replace(/\n/g, " ").trim();

    return res.json({ message: summaryString });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to summarize" });
  }
};

const generateSubtasks = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({ message: "No task for this ID" });
    }
    const genModel = model();
    const subtaskSchema = {
      type: "object",
      properties: {
        subtasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              estimate_minutes: { type: "integer" },
              dueDate: { type: "string", format: "date-time", nullable: true },
              priority: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              userID: { type: "string" },
            },
            required: ["title", "estimate_minutes", "priority", "userID"],
          },
        },
      },
      required: ["subtasks"],
    };
    const subTaskPrompt = `Return only JSON matching the schema. Break down this task into 4–8 subtasks: ${JSON.stringify(task)}`;
    const result = await genModel.generateContent({
      contents: [
        {
          parts: [
            {
              text: subTaskPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: subtaskSchema,
      },
    });
    const text = result.response.text().trim();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    await taskSchema.findByIdAndUpdate(req.params.id, {
      subtasks: parsed.subtasks,
    });

    return res.json({ message: parsed.subtasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate subtasks" });
  }
};
const rewrite = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({ message: "No task for this ID" });
    }
    const genModel = model();
    const responseSchema = {
      type: "object",
      properties: {
        task: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
      required: ["task"],
    };
    const rewritePrompt = `You are a Task Rewriting Tool. Given a single JSON task object as input, output only JSON with a top-level key "task" mapping to an improved, clearer, and tangentially better version of the original task. Follow these rules:
    Use fields title, description to rewrite and enhance the task. ignore other fields,
    Preserve the original intent but improve clarity, specificity, and actionability; add one or two useful tangential enhancements (e.g., success criteria, suggested deliverables, preferred format, or key stakeholders).
    Output fields for the rewritten task object:
    "title": concise, action-oriented (≤8 words).
    "description": 1–3 sentences that clarify scope, deliverables, and any assumptions.
    Do not add any keys beyond those listed.
    Output must be valid JSON only—no extra text or commentary._ this is the input task: ${JSON.stringify(task)}`;
    const result = await genModel.generateContent({
      contents: [{ parts: [{ text: rewritePrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });
    const text = result.response.text().trim();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    const updatedTask = await taskSchema.findByIdAndUpdate(req.params.id, {
      title: parsed.task.title,
      description: parsed.task.description,
    });
    return res.json({ message: updatedTask });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to rewrite and update task" });
  }
};

const estimate = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      return res.json({ message: "No task for this ID" });
    }
    const genModel = model();
    const responseSchema = {
      type: "object",
      properties: {
        analysis: {
          type: "object",
          properties: {
            complexity_level: {
              type: "string",
              enum: ["Very Low", "Low", "Medium", "High", "Very High"],
            },
            confidence: { type: "integer", minimum: 30, maximum: 100 },
            estimated_total_minutes: { type: "integer" },
            breakdown: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  minutes: { type: "integer" },
                  notes: { type: "string" },
                },
                required: ["minutes", "notes"],
              },
            },
            critical_risks: { type: "array", items: { type: "string" } },
            assumptions: { type: "array", items: { type: "string" } },
          },
          required: [
            "complexity_level",
            "confidence",
            "estimated_total_minutes",
            "breakdown",
            "critical_risks",
            "assumptions",
          ],
        },
      },
      required: ["analysis"],
    };
    const estimatePrompt = `Analyze this task and return JSON with "analysis": ${JSON.stringify(task)}`;
    const result = await genModel.generateContent({
      contents: [{ parts: [{ text: estimatePrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });
    const text = result.response.text().trim();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    await taskSchema.findByIdAndUpdate(req.params.id, {
      estimate: parsed.analysis,
    });
    return res.json({ message: parsed.analysis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to estimate and save task" });
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
