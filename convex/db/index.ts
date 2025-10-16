/**
 * Database Layer Barrel Export
 *
 * Re-exports all database operations for easy importing.
 * This is the only way endpoint and workflow layers should access the database.
 *
 * Usage:
 * ```typescript
 * import * as Tasks from "../db/tasks";
 * import * as TaskComments from "../db/taskComments";
 * ```
 */

export * as Tasks from "./tasks";
export * as TaskComments from "./taskComments";
export * as TaskActivity from "./taskActivity";
export * as UserPreferences from "./userPreferences";
