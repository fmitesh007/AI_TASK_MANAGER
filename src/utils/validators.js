const { z } = require("zod");

const baseUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

const userSchemaZod = baseUserSchema;

// Partial schema for profile updates — all fields optional
const updateProfileSchemaZod = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 chars").optional(),
});

const taskSchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().optional(),
  userID: z.string().optional(),
});

module.exports = {
  userSchemaZod,
  updateProfileSchemaZod,
  taskSchemaZod,
};
