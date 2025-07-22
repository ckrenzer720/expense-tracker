// Type definitions for the expense tracker application
// These serve as documentation and can be easily converted to TypeScript later

/**
 * @typedef {Object} Expense
 * @property {string} id - Unique identifier for the expense
 * @property {number} amount - Expense amount in dollars
 * @property {string} category - Category ID the expense belongs to
 * @property {string} date - Date of the expense (YYYY-MM-DD format)
 * @property {string} notes - Optional notes about the expense
 * @property {string} createdAt - ISO timestamp when expense was created
 * @property {string} updatedAt - ISO timestamp when expense was last updated
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Display name of the category
 * @property {string} color - Hex color code for the category
 * @property {string} icon - Emoji icon for the category
 * @property {boolean} isCustom - Whether this is a custom category
 */

/**
 * @typedef {Object} Budget
 * @property {string} id - Unique identifier for the budget
 * @property {string} categoryId - Category ID this budget belongs to
 * @property {number} amount - Budget amount in dollars
 * @property {string} month - Month in YYYY-MM format
 * @property {boolean} rollover - Whether unused budget rolls over to next month
 * @property {string} createdAt - ISO timestamp when budget was created
 * @property {string} updatedAt - ISO timestamp when budget was last updated
 */

/**
 * @typedef {Object} BudgetRollover
 * @property {string} categoryId - Category ID for the rollover
 * @property {number} amount - Amount rolling over from previous month
 * @property {string} fromMonth - Month the rollover is from (YYYY-MM format)
 * @property {string} toMonth - Month the rollover is to (YYYY-MM format)
 */

/**
 * @typedef {Object} MonthlyBudgetSummary
 * @property {string} month - Month in YYYY-MM format
 * @property {number} totalBudget - Total budget amount for the month
 * @property {number} totalSpent - Total amount spent in the month
 * @property {number} totalRemaining - Total remaining budget
 * @property {number} rolloverAmount - Total amount rolled over from previous month
 * @property {Array<Budget>} budgets - Array of individual category budgets
 */

/**
 * @typedef {Object} BudgetAlert
 * @property {string} categoryId - Category ID for the alert
 * @property {string} type - Alert type ('warning', 'danger', 'info')
 * @property {string} message - Alert message
 * @property {number} percentage - Percentage of budget used
 * @property {boolean} isOverBudget - Whether budget is exceeded
 */

/**
 * @typedef {Object} AppSettings
 * @property {string} currency - Currency code (e.g., 'USD')
 * @property {string} dateFormat - Date format preference
 * @property {string} theme - Theme preference ('light' | 'dark')
 * @property {boolean} notifications - Whether notifications are enabled
 */

/**
 * @typedef {Object} ExpenseFormData
 * @property {string} amount - Amount as string (for form input)
 * @property {string} category - Selected category ID
 * @property {string} date - Selected date (YYYY-MM-DD format)
 * @property {string} notes - Optional notes
 */

/**
 * @typedef {Object} ValidationError
 * @property {boolean} isValid - Whether the data is valid
 * @property {Object} errors - Object containing field-specific error messages
 */

/**
 * @typedef {Object} CategoryData
 * @property {string} id - Category ID
 * @property {string} name - Category name
 * @property {string} color - Category color
 * @property {string} icon - Category icon
 * @property {number} total - Total spent in this category
 * @property {number} percentage - Percentage of total spending
 * @property {number} count - Number of transactions in this category
 */

/**
 * @typedef {Object} MonthlyTrend
 * @property {string} month - Month abbreviation (e.g., 'Jan')
 * @property {number} amount - Total spending for that month
 */

/**
 * @typedef {Object} BudgetProgress
 * @property {number} spent - Amount spent in category
 * @property {number} budget - Budget amount for category
 * @property {number} remaining - Remaining budget
 * @property {number} percentage - Percentage of budget used
 */

// Export types for use in JSDoc comments
export const TYPES = {
  Expense: "Expense",
  Category: "Category",
  Budget: "Budget",
  BudgetRollover: "BudgetRollover",
  MonthlyBudgetSummary: "MonthlyBudgetSummary",
  BudgetAlert: "BudgetAlert",
  AppSettings: "AppSettings",
  ExpenseFormData: "ExpenseFormData",
  ValidationError: "ValidationError",
  CategoryData: "CategoryData",
  MonthlyTrend: "MonthlyTrend",
  BudgetProgress: "BudgetProgress",
};
