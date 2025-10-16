/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate task title
 */
export function isValidTaskTitle(title: string): boolean {
  return title.length > 0 && title.length <= 200;
}

/**
 * Validate task description
 */
export function isValidTaskDescription(description: string | undefined): boolean {
  if (description === undefined) return true;
  return description.length <= 2000;
}

/**
 * Validate comment content
 */
export function isValidCommentContent(content: string): boolean {
  return content.length > 0 && content.length <= 1000;
}

/**
 * Validate due date (must be in the future or today)
 */
export function isValidDueDate(dueDate: number | undefined): boolean {
  if (dueDate === undefined) return true;
  const now = Date.now();
  // Allow dates from today onwards (subtract 24 hours for timezone tolerance)
  return dueDate >= now - 24 * 60 * 60 * 1000;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (remove leading/trailing whitespace)
 */
export function sanitizeString(input: string): string {
  return input.trim();
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  min: number = 0,
  max: number = Infinity
): boolean {
  return value.length >= min && value.length <= max;
}
