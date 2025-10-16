import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for To-Do List Application
 *
 * Architecture: Four-layer Convex pattern (Cleargent)
 * - Database layer: Pure CRUD operations (convex/db/)
 * - Endpoint layer: Business logic (convex/endpoints/)
 * - Workflow layer: External service integrations (not needed for this app)
 * - Helper layer: Pure utilities (convex/helpers/)
 */

export default defineSchema({
  /**
   * Tasks - Core to-do list items
   *
   * Each task belongs to a single user and tracks:
   * - Content (title, description)
   * - Status (pending, in_progress, completed)
   * - Priority (low, medium, high)
   * - Timestamps for creation and updates
   */
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_priority", ["userId", "priority"])
    .index("by_user_and_due_date", ["userId", "dueDate"]),

  /**
   * Task Comments - Optional feature for adding notes/comments to tasks
   *
   * Enables users to:
   * - Add context and updates to tasks
   * - Track discussion history
   * - Maintain chronological record
   */
  taskComments: defineTable({
    taskId: v.id("tasks"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_user", ["userId"])
    .index("by_task_and_created", ["taskId", "createdAt"]),

  /**
   * Task Activity Log - Audit trail for task changes
   *
   * Tracks:
   * - Who made changes (userId)
   * - What changed (action type)
   * - When changes occurred (createdAt)
   * - Metadata about the change
   */
  taskActivity: defineTable({
    taskId: v.id("tasks"),
    userId: v.string(),
    action: v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("completed"),
      v.literal("deleted"),
      v.literal("commented")
    ),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_user", ["userId"])
    .index("by_task_and_created", ["taskId", "createdAt"]),

  /**
   * User Preferences - Settings and customization per user
   *
   * Stores:
   * - Display preferences (theme, density)
   * - Default filters and views
   * - Notification settings
   */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    defaultView: v.optional(v.union(v.literal("list"), v.literal("board"))),
    defaultFilter: v.optional(v.string()),
    notificationsEnabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
