/**
 * Application Constants
 *
 * Centralized constants used across the application.
 * NO database access, NO ctx parameter.
 */

// Task status values
export const TASK_STATUSES = {
  PENDING: "pending" as const,
  IN_PROGRESS: "in_progress" as const,
  COMPLETED: "completed" as const,
};

// Task priority values
export const TASK_PRIORITIES = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

// Activity action types
export const ACTIVITY_ACTIONS = {
  CREATED: "created" as const,
  UPDATED: "updated" as const,
  COMPLETED: "completed" as const,
  DELETED: "deleted" as const,
  COMMENTED: "commented" as const,
};

// Theme options
export const THEMES = {
  LIGHT: "light" as const,
  DARK: "dark" as const,
  SYSTEM: "system" as const,
};

// View options
export const VIEWS = {
  LIST: "list" as const,
  BOARD: "board" as const,
};

// Validation limits
export const LIMITS = {
  TASK_TITLE_MAX: 200,
  TASK_DESCRIPTION_MAX: 2000,
  COMMENT_CONTENT_MAX: 1000,
};

// Time constants
export const TIME = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};
