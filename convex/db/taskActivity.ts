/**
 * Database Layer: Task Activity
 *
 * This is the ONLY file that directly accesses the taskActivity table using ctx.db.
 * All task activity log operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Types for activity actions
export type ActivityAction = "created" | "updated" | "completed" | "deleted" | "commented";

// CREATE
export async function createTaskActivity(
  ctx: MutationCtx,
  args: {
    taskId: Id<"tasks">;
    userId: string;
    action: ActivityAction;
    metadata?: any;
  }
) {
  return await ctx.db.insert("taskActivity", {
    ...args,
    createdAt: Date.now(),
  });
}

// READ - Get by ID
export async function getTaskActivityById(
  ctx: QueryCtx,
  id: Id<"taskActivity">
) {
  return await ctx.db.get(id);
}

// READ - Get all activity for a task
export async function getActivityByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">
) {
  return await ctx.db
    .query("taskActivity")
    .withIndex("by_task_and_created", (q) => q.eq("taskId", taskId))
    .order("desc")
    .collect();
}

// READ - Get activity by user
export async function getActivityByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("taskActivity")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get recent activity for a task (last N activities)
export async function getRecentActivityByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">,
  limit: number = 10
) {
  return await ctx.db
    .query("taskActivity")
    .withIndex("by_task_and_created", (q) => q.eq("taskId", taskId))
    .order("desc")
    .take(limit);
}

// READ - Get recent activity by user (last N activities)
export async function getRecentActivityByUser(
  ctx: QueryCtx,
  userId: string,
  limit: number = 20
) {
  return await ctx.db
    .query("taskActivity")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);
}

// DELETE
export async function deleteTaskActivity(
  ctx: MutationCtx,
  id: Id<"taskActivity">
) {
  return await ctx.db.delete(id);
}

// DELETE - Delete all activity for a task
export async function deleteActivityByTask(
  ctx: MutationCtx,
  taskId: Id<"tasks">
) {
  const activities = await ctx.db
    .query("taskActivity")
    .withIndex("by_task", (q) => q.eq("taskId", taskId))
    .collect();

  await Promise.all(
    activities.map((activity) => ctx.db.delete(activity._id))
  );
}

// COUNT - Get activity count for a task
export async function getActivityCountByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">
) {
  const activities = await ctx.db
    .query("taskActivity")
    .withIndex("by_task", (q) => q.eq("taskId", taskId))
    .collect();

  return activities.length;
}
