/**
 * Endpoint Layer: Dashboard
 *
 * Aggregated data and metrics for the dashboard view.
 * Provides summary statistics and recent activity.
 */

import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Tasks from "../db/tasks";
import * as TaskActivity from "../db/taskActivity";

/**
 * Get dashboard summary with key metrics
 */
export const summary = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get task counts by status
    const taskCounts = await Tasks.getTaskCountsByStatus(ctx, authUser._id);

    // Get overdue tasks
    const overdueTasks = await Tasks.getOverdueTasksByUser(ctx, authUser._id);

    // Get upcoming tasks
    const upcomingTasks = await Tasks.getUpcomingTasksByUser(ctx, authUser._id);

    return {
      totalTasks: taskCounts.total,
      pendingTasks: taskCounts.pending,
      inProgressTasks: taskCounts.in_progress,
      completedTasks: taskCounts.completed,
      overdueTasks: overdueTasks.length,
      upcomingTasks: upcomingTasks.length,
    };
  },
});

/**
 * Get recent tasks (last 10)
 */
export const recent = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const allTasks = await Tasks.getTasksByUser(ctx, authUser._id);

    // Return most recent 10 tasks
    return allTasks.slice(0, 10);
  },
});

/**
 * Get recent activity (last 20 activities)
 */
export const recentActivity = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await TaskActivity.getRecentActivityByUser(ctx, authUser._id, 20);
  },
});

/**
 * Get tasks grouped by priority
 */
export const tasksByPriority = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const allTasks = await Tasks.getTasksByUser(ctx, authUser._id);

    // Group by priority
    const highPriority = allTasks.filter((t) => t.priority === "high" && t.status !== "completed");
    const mediumPriority = allTasks.filter((t) => t.priority === "medium" && t.status !== "completed");
    const lowPriority = allTasks.filter((t) => t.priority === "low" && t.status !== "completed");

    return {
      high: highPriority.length,
      medium: mediumPriority.length,
      low: lowPriority.length,
    };
  },
});

/**
 * Get completion statistics
 */
export const completionStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const allTasks = await Tasks.getTasksByUser(ctx, authUser._id);

    // Calculate completion percentage
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === "completed").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get completed tasks in the last 7 days
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentCompletions = allTasks.filter(
      (t) => t.completedAt && t.completedAt >= sevenDaysAgo
    ).length;

    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      recentCompletions,
    };
  },
});
