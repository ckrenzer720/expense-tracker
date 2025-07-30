/**
 * Budget utilities for the expense tracker application
 */

import {
  createDefaultMonthlyBudgets,
  STORAGE_KEYS,
} from "../constants/categories";

/**
 * Get current month in YYYY-MM format
 * @returns {string} Current month
 */
export const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const monthNum = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${monthNum}`;
};

/**
 * Get previous month in YYYY-MM format
 * @param {string} month - Month in YYYY-MM format
 * @returns {string} Previous month
 */
export const getPreviousMonth = (month = null) => {
  let date;
  if (month) {
    const [year, monthNum] = month.split("-").map(Number);
    date = new Date(year, monthNum - 1, 1);
  } else {
    date = new Date();
  }
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const monthNum = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${monthNum}`;
};

/**
 * Get next month in YYYY-MM format
 * @param {string} month - Month in YYYY-MM format
 * @returns {string} Next month
 */
export const getNextMonth = (month = null) => {
  let date;
  if (month) {
    const [year, monthNum] = month.split("-").map(Number);
    date = new Date(year, monthNum - 1, 1);
  } else {
    date = new Date();
  }
  date.setMonth(date.getMonth() + 1);
  const year = date.getFullYear();
  const monthNum = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${monthNum}`;
};

/**
 * Format month for display (e.g., "January 2024")
 * @param {string} month - Month in YYYY-MM format
 * @returns {string} Formatted month
 */
export const formatMonth = (month) => {
  const [year, monthNum] = month.split("-").map(Number);
  const date = new Date(year, monthNum - 1, 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

/**
 * Get budget for a specific category and month
 * @param {Array} budgets - Array of budget objects
 * @param {string} categoryId - Category ID
 * @param {string} month - Month in YYYY-MM format
 * @returns {Object|null} Budget object or null if not found
 */
export const getBudgetForCategory = (budgets, categoryId, month) => {
  const budget = budgets.find(
    (budget) => budget.categoryId === categoryId && budget.month === month
  );
  return budget || null;
};

/**
 * Get all budgets for a specific month
 * @param {Array} budgets - Array of budget objects
 * @param {string} month - Month in YYYY-MM format
 * @returns {Array} Array of budget objects for the month
 */
export const getBudgetsForMonth = (budgets, month) => {
  return budgets.filter((budget) => budget.month === month);
};

/**
 * Calculate total budget amount for a month
 * @param {Array} budgets - Array of budget objects
 * @param {string} month - Month in YYYY-MM format
 * @returns {number} Total budget amount
 */
export const getTotalBudgetForMonth = (budgets, month) => {
  const monthBudgets = getBudgetsForMonth(budgets, month);
  return monthBudgets.reduce((total, budget) => total + budget.amount, 0);
};

/**
 * Migrate legacy budget format to new monthly budget format
 * @param {Object} legacyBudgets - Legacy budget object {categoryId: amount}
 * @param {string} month - Month to create budgets for
 * @returns {Array} Array of new budget objects
 */
export const migrateLegacyBudgets = (legacyBudgets, month = null) => {
  const targetMonth = month || getCurrentMonth();

  return Object.entries(legacyBudgets).map(([categoryId, amount]) => ({
    id: `${categoryId}-${targetMonth}`,
    categoryId,
    amount: parseFloat(amount) || 0,
    month: targetMonth,
    rollover: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

/**
 * Apply budget rollover from previous month
 * @param {Array} budgets - Array of budget objects
 * @param {string} month - Target month
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} Updated budgets with rollover applied
 */
export const applyBudgetRollover = (budgets, month, expenses) => {
  const previousMonth = getPreviousMonth(month);
  const previousBudgets = getBudgetsForMonth(budgets, previousMonth);
  const currentBudgets = getBudgetsForMonth(budgets, month);

  // Filter expenses for previous month
  const previousMonthExpenses = expenses.filter((expense) =>
    expense.date.startsWith(previousMonth)
  );

  // Calculate rollover amounts for each category
  const rolloverAmounts = {};
  previousBudgets.forEach((budget) => {
    if (budget.rollover) {
      const spent = previousMonthExpenses
        .filter((expense) => expense.category === budget.categoryId)
        .reduce((total, expense) => total + expense.amount, 0);

      const remaining = Math.max(0, budget.amount - spent);
      rolloverAmounts[budget.categoryId] = remaining;
    }
  });

  // Apply rollover to current month budgets
  return budgets.map((budget) => {
    if (budget.month === month && rolloverAmounts[budget.categoryId]) {
      return {
        ...budget,
        amount: budget.amount + rolloverAmounts[budget.categoryId],
        updatedAt: new Date().toISOString(),
      };
    }
    return budget;
  });
};

/**
 * Create budgets for a new month
 * @param {Array} budgets - Existing budgets
 * @param {string} month - Month to create budgets for
 * @param {boolean} useRollover - Whether to apply rollover from previous month
 * @param {Array} expenses - Array of expense objects for rollover calculation
 * @returns {Array} Updated budgets array
 */
export const createBudgetsForMonth = (
  budgets,
  month,
  useRollover = true,
  expenses = []
) => {
  const existingBudgets = getBudgetsForMonth(budgets, month);

  // If budgets already exist for this month, return as is
  if (existingBudgets.length > 0) {
    return budgets;
  }

  // Create default budgets for the month
  const defaultBudgets = createDefaultMonthlyBudgets(month);

  // Add new budgets to existing array
  const updatedBudgets = [...budgets, ...defaultBudgets];

  // Apply rollover if requested
  if (useRollover) {
    return applyBudgetRollover(updatedBudgets, month, expenses);
  }

  return updatedBudgets;
};

/**
 * Validate budget object
 * @param {Object} budget - Budget object to validate
 * @returns {Object} Validation result {isValid, error}
 */
export const validateBudget = (budget) => {
  if (!budget || typeof budget !== "object") {
    return { isValid: false, error: "Invalid budget object" };
  }

  if (!budget.id || typeof budget.id !== "string") {
    return { isValid: false, error: "Invalid budget ID" };
  }

  if (!budget.categoryId || typeof budget.categoryId !== "string") {
    return { isValid: false, error: "Invalid category ID" };
  }

  if (typeof budget.amount !== "number" || budget.amount < 0) {
    return { isValid: false, error: "Invalid budget amount" };
  }

  if (!budget.month || !/^\d{4}-\d{2}$/.test(budget.month)) {
    return { isValid: false, error: "Invalid month format (YYYY-MM)" };
  }

  if (typeof budget.rollover !== "boolean") {
    return { isValid: false, error: "Invalid rollover flag" };
  }

  return { isValid: true };
};

/**
 * Load budgets from localStorage with migration support
 * @returns {Array} Array of budget objects
 */
export const loadBudgetsFromStorage = () => {
  try {
    // Try to load new format first
    const newBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS_V2);
    if (newBudgets) {
      const parsed = JSON.parse(newBudgets);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // Fall back to legacy format and migrate
    const legacyBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (legacyBudgets) {
      const parsed = JSON.parse(legacyBudgets);
      if (parsed && typeof parsed === "object") {
        const migrated = migrateLegacyBudgets(parsed);

        // Save migrated data
        localStorage.setItem(STORAGE_KEYS.BUDGETS_V2, JSON.stringify(migrated));

        // Clean up legacy data
        localStorage.removeItem(STORAGE_KEYS.BUDGETS);

        return migrated;
      }
    }

    // Return default budgets if nothing found
    return createDefaultMonthlyBudgets();
  } catch (error) {
    console.error("Error loading budgets:", error);
    return createDefaultMonthlyBudgets();
  }
};

/**
 * Save budgets to localStorage
 * @param {Array} budgets - Array of budget objects
 */
export const saveBudgetsToStorage = (budgets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS_V2, JSON.stringify(budgets));
  } catch (error) {
    console.error("Error saving budgets:", error);
    throw error;
  }
};
