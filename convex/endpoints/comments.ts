/**
 * Endpoint Layer: Comments
 *
 * Business logic for task comments.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as TaskComments from "../db/taskComments";
import * as TaskActivity from "../db/taskActivity";
import * as Tasks from "../db/tasks";
import { isValidCommentContent, sanitizeString } from "../helpers/validation";

/**
 * Create a new comment on a task
 */
export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "createComment", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Verify task exists and user has access
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to comment on this task");
    }

    // 4. Validation
    const content = sanitizeString(args.content);
    if (!isValidCommentContent(content)) {
      throw new Error("Comment must be between 1 and 1000 characters");
    }

    // 5. Create comment
    const commentId = await TaskComments.createTaskComment(ctx, {
      taskId: args.taskId,
      userId: authUser._id,
      content,
    });

    // 6. Log activity
    await TaskActivity.createTaskActivity(ctx, {
      taskId: args.taskId,
      userId: authUser._id,
      action: "commented",
      metadata: {
        commentId,
        preview: content.substring(0, 100),
      },
    });

    return commentId;
  },
});

/**
 * List all comments for a task
 */
export const listByTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify task exists and user has access
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to view comments on this task");
    }

    return await TaskComments.getCommentsByTask(ctx, args.taskId);
  },
});

/**
 * Get a specific comment by ID
 */
export const getById = query({
  args: {
    id: v.id("taskComments"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const comment = await TaskComments.getTaskCommentById(ctx, args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Verify ownership
    if (comment.userId !== authUser._id) {
      throw new Error("Not authorized to view this comment");
    }

    return comment;
  },
});

/**
 * Update a comment
 */
export const update = mutation({
  args: {
    id: v.id("taskComments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updateComment", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Verify ownership
    const comment = await TaskComments.getTaskCommentById(ctx, args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== authUser._id) {
      throw new Error("Not authorized to update this comment");
    }

    // 4. Validation
    const content = sanitizeString(args.content);
    if (!isValidCommentContent(content)) {
      throw new Error("Comment must be between 1 and 1000 characters");
    }

    // 5. Update comment
    await TaskComments.updateTaskComment(ctx, args.id, { content });

    return args.id;
  },
});

/**
 * Delete a comment
 */
export const remove = mutation({
  args: {
    id: v.id("taskComments"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "deleteComment", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Verify ownership
    const comment = await TaskComments.getTaskCommentById(ctx, args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== authUser._id) {
      throw new Error("Not authorized to delete this comment");
    }

    // 4. Delete comment
    await TaskComments.deleteTaskComment(ctx, args.id);

    return args.id;
  },
});

/**
 * Get comment count for a task
 */
export const getCount = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify task exists and user has access
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to view this task");
    }

    return await TaskComments.getCommentCountByTask(ctx, args.taskId);
  },
});
