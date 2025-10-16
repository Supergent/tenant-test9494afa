/**
 * Database Layer: Task Comments
 *
 * This is the ONLY file that directly accesses the taskComments table using ctx.db.
 * All task comment-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTaskComment(
  ctx: MutationCtx,
  args: {
    taskId: Id<"tasks">;
    userId: string;
    content: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("taskComments", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTaskCommentById(
  ctx: QueryCtx,
  id: Id<"taskComments">
) {
  return await ctx.db.get(id);
}

// READ - Get all comments for a task
export async function getCommentsByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">
) {
  return await ctx.db
    .query("taskComments")
    .withIndex("by_task_and_created", (q) => q.eq("taskId", taskId))
    .order("asc")
    .collect();
}

// READ - Get comments by user
export async function getCommentsByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("taskComments")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get recent comments for a task (last N comments)
export async function getRecentCommentsByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">,
  limit: number = 5
) {
  const comments = await ctx.db
    .query("taskComments")
    .withIndex("by_task_and_created", (q) => q.eq("taskId", taskId))
    .order("desc")
    .take(limit);

  // Reverse to get chronological order (oldest to newest)
  return comments.reverse();
}

// UPDATE
export async function updateTaskComment(
  ctx: MutationCtx,
  id: Id<"taskComments">,
  args: {
    content: string;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTaskComment(
  ctx: MutationCtx,
  id: Id<"taskComments">
) {
  return await ctx.db.delete(id);
}

// DELETE - Delete all comments for a task
export async function deleteCommentsByTask(
  ctx: MutationCtx,
  taskId: Id<"tasks">
) {
  const comments = await ctx.db
    .query("taskComments")
    .withIndex("by_task", (q) => q.eq("taskId", taskId))
    .collect();

  await Promise.all(
    comments.map((comment) => ctx.db.delete(comment._id))
  );
}

// COUNT - Get comment count for a task
export async function getCommentCountByTask(
  ctx: QueryCtx,
  taskId: Id<"tasks">
) {
  const comments = await ctx.db
    .query("taskComments")
    .withIndex("by_task", (q) => q.eq("taskId", taskId))
    .collect();

  return comments.length;
}
