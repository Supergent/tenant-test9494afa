/**
 * Endpoint Layer: Tasks
 *
 * Business logic for task management.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Tasks from "../db/tasks";
import * as TaskActivity from "../db/taskActivity";
import { isValidTaskTitle, isValidTaskDescription, isValidDueDate, sanitizeString } from "../helpers/validation";

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "createTask", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Validation
    const title = sanitizeString(args.title);
    if (!isValidTaskTitle(title)) {
      throw new Error("Task title must be between 1 and 200 characters");
    }

    if (args.description && !isValidTaskDescription(args.description)) {
      throw new Error("Task description must be less than 2000 characters");
    }

    if (!isValidDueDate(args.dueDate)) {
      throw new Error("Due date must be in the future");
    }

    // 4. Create task
    const taskId = await Tasks.createTask(ctx, {
      userId: authUser._id,
      title,
      description: args.description,
      status: "pending",
      priority: args.priority,
      dueDate: args.dueDate,
    });

    // 5. Log activity
    await TaskActivity.createTaskActivity(ctx, {
      taskId,
      userId: authUser._id,
      action: "created",
      metadata: {
        title,
        priority: args.priority,
      },
    });

    return taskId;
  },
});

/**
 * List all tasks for the current user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByUser(ctx, authUser._id);
  },
});

/**
 * List tasks by status
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByUserAndStatus(ctx, authUser._id, args.status);
  },
});

/**
 * List tasks by priority
 */
export const listByPriority = query({
  args: {
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByUserAndPriority(ctx, authUser._id, args.priority);
  },
});

/**
 * Get overdue tasks
 */
export const listOverdue = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getOverdueTasksByUser(ctx, authUser._id);
  },
});

/**
 * Get upcoming tasks (next 7 days)
 */
export const listUpcoming = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getUpcomingTasksByUser(ctx, authUser._id);
  },
});

/**
 * Get task by ID
 */
export const getById = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify ownership
    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to view this task");
    }

    return task;
  },
});

/**
 * Update a task
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updateTask", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to update this task");
    }

    // 4. Validation
    if (args.title) {
      const title = sanitizeString(args.title);
      if (!isValidTaskTitle(title)) {
        throw new Error("Task title must be between 1 and 200 characters");
      }
    }

    if (args.description !== undefined && !isValidTaskDescription(args.description)) {
      throw new Error("Task description must be less than 2000 characters");
    }

    if (!isValidDueDate(args.dueDate)) {
      throw new Error("Due date must be in the future");
    }

    // 5. Prepare update data
    const updateData: Parameters<typeof Tasks.updateTask>[2] = {};
    if (args.title) updateData.title = sanitizeString(args.title);
    if (args.description !== undefined) updateData.description = args.description;
    if (args.status) updateData.status = args.status;
    if (args.priority) updateData.priority = args.priority;
    if (args.dueDate !== undefined) updateData.dueDate = args.dueDate;

    // Set completedAt when task is completed
    if (args.status === "completed" && task.status !== "completed") {
      updateData.completedAt = Date.now();
    }

    // 6. Update task
    await Tasks.updateTask(ctx, args.id, updateData);

    // 7. Log activity
    await TaskActivity.createTaskActivity(ctx, {
      taskId: args.id,
      userId: authUser._id,
      action: args.status === "completed" ? "completed" : "updated",
      metadata: updateData,
    });

    return args.id;
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "deleteTask", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to delete this task");
    }

    // 4. Log activity before deleting
    await TaskActivity.createTaskActivity(ctx, {
      taskId: args.id,
      userId: authUser._id,
      action: "deleted",
      metadata: {
        title: task.title,
      },
    });

    // 5. Delete task
    await Tasks.deleteTask(ctx, args.id);

    return args.id;
  },
});

/**
 * Get task statistics
 */
export const getStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTaskCountsByStatus(ctx, authUser._id);
  },
});
