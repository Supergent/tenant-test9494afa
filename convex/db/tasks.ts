/**
 * Database Layer: Tasks
 *
 * This is the ONLY file that directly accesses the tasks table using ctx.db.
 * All tasks-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Types for task status and priority
export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

// CREATE
export async function createTask(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: number;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTaskById(
  ctx: QueryCtx,
  id: Id<"tasks">
) {
  return await ctx.db.get(id);
}

// READ - Get all tasks by user
export async function getTasksByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get tasks by user and status
export async function getTasksByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: TaskStatus
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

// READ - Get tasks by user and priority
export async function getTasksByUserAndPriority(
  ctx: QueryCtx,
  userId: string,
  priority: TaskPriority
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

// READ - Get overdue tasks by user
export async function getOverdueTasksByUser(
  ctx: QueryCtx,
  userId: string
) {
  const now = Date.now();
  const allTasks = await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return allTasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate < now &&
      task.status !== "completed"
  );
}

// READ - Get upcoming tasks (next 7 days)
export async function getUpcomingTasksByUser(
  ctx: QueryCtx,
  userId: string
) {
  const now = Date.now();
  const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;

  const allTasks = await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return allTasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate >= now &&
      task.dueDate <= weekFromNow &&
      task.status !== "completed"
  );
}

// UPDATE
export async function updateTask(
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: number;
    completedAt?: number;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTask(
  ctx: MutationCtx,
  id: Id<"tasks">
) {
  return await ctx.db.delete(id);
}

// COUNT - Get task counts by status
export async function getTaskCountsByStatus(
  ctx: QueryCtx,
  userId: string
) {
  const allTasks = await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return {
    pending: allTasks.filter((t) => t.status === "pending").length,
    in_progress: allTasks.filter((t) => t.status === "in_progress").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
    total: allTasks.length,
  };
}
