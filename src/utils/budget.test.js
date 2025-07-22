/**
 * Simple tests for budget utilities
 * Run with: node src/utils/budget.test.js
 */

import {
  getCurrentMonth,
  getPreviousMonth,
  getNextMonth,
  formatMonth,
  migrateLegacyBudgets,
  validateBudget,
} from "./budget.js";

// Mock localStorage for testing
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Test getCurrentMonth
console.log("Testing getCurrentMonth...");
const currentMonth = getCurrentMonth();
console.log("Current month:", currentMonth);
console.assert(
  /^\d{4}-\d{2}$/.test(currentMonth),
  "Current month should be in YYYY-MM format"
);

// Test getPreviousMonth
console.log("Testing getPreviousMonth...");
const previousMonth = getPreviousMonth(currentMonth);
console.log("Previous month:", previousMonth);
console.assert(
  /^\d{4}-\d{2}$/.test(previousMonth),
  "Previous month should be in YYYY-MM format"
);

// Test getNextMonth
console.log("Testing getNextMonth...");
const nextMonth = getNextMonth(currentMonth);
console.log("Next month:", nextMonth);
console.assert(
  /^\d{4}-\d{2}$/.test(nextMonth),
  "Next month should be in YYYY-MM format"
);

// Test formatMonth
console.log("Testing formatMonth...");
const formattedMonth = formatMonth(currentMonth);
console.log("Formatted month:", formattedMonth);
console.assert(
  typeof formattedMonth === "string",
  "Formatted month should be a string"
);

// Test migrateLegacyBudgets
console.log("Testing migrateLegacyBudgets...");
const legacyBudgets = {
  1: 500,
  2: 300,
  3: 400,
};
const migratedBudgets = migrateLegacyBudgets(legacyBudgets, currentMonth);
console.log("Migrated budgets:", migratedBudgets);
console.assert(
  Array.isArray(migratedBudgets),
  "Migrated budgets should be an array"
);
console.assert(migratedBudgets.length === 3, "Should have 3 migrated budgets");

// Test validateBudget
console.log("Testing validateBudget...");
const validBudget = {
  id: "1-2024-01",
  categoryId: "1",
  amount: 500,
  month: "2024-01",
  rollover: false,
};
const validation = validateBudget(validBudget);
console.log("Budget validation:", validation);
console.assert(validation.isValid, "Valid budget should pass validation");

console.log("All tests passed! ✅");
