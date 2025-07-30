/**
 * Simple tests for budget utilities
 * Run with: node src/utils/budget.test.js
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCurrentMonth,
  getPreviousMonth,
  getNextMonth,
  formatMonth,
  migrateLegacyBudgets,
  validateBudget,
  getBudgetForCategory,
  getBudgetsForMonth,
  getTotalBudgetForMonth,
} from "./budget.js";

describe("Budget Utilities", () => {
  beforeEach(() => {
    // Reset localStorage mock before each test
    vi.clearAllMocks();
  });

  describe("getCurrentMonth", () => {
    it("should return current month in YYYY-MM format", () => {
      const currentMonth = getCurrentMonth();
      expect(currentMonth).toMatch(/^\d{4}-\d{2}$/);
      expect(currentMonth).toBe(new Date().toISOString().slice(0, 7));
    });
  });

  describe("getPreviousMonth", () => {
    it("should return previous month in YYYY-MM format", () => {
      const currentMonth = "2024-01";
      const previousMonth = getPreviousMonth(currentMonth);
      expect(previousMonth).toBe("2023-12");
    });

    it("should handle year boundary correctly", () => {
      const currentMonth = "2024-01";
      const previousMonth = getPreviousMonth(currentMonth);
      expect(previousMonth).toBe("2023-12");
    });

    it("should use current month when no parameter provided", () => {
      const previousMonth = getPreviousMonth();
      const expected = new Date();
      expected.setMonth(expected.getMonth() - 1);
      expect(previousMonth).toBe(expected.toISOString().slice(0, 7));
    });
  });

  describe("getNextMonth", () => {
    it("should return next month in YYYY-MM format", () => {
      const currentMonth = "2024-01";
      const nextMonth = getNextMonth(currentMonth);
      expect(nextMonth).toBe("2024-02");
    });

    it("should handle year boundary correctly", () => {
      const currentMonth = "2024-12";
      const nextMonth = getNextMonth(currentMonth);
      expect(nextMonth).toBe("2025-01");
    });

    it("should use current month when no parameter provided", () => {
      const nextMonth = getNextMonth();
      const expected = new Date();
      expected.setMonth(expected.getMonth() + 1);
      expect(nextMonth).toBe(expected.toISOString().slice(0, 7));
    });
  });

  describe("formatMonth", () => {
    it("should format month for display", () => {
      const formattedMonth = formatMonth("2024-01");
      expect(formattedMonth).toBe("January 2024");
    });

    it("should handle different months correctly", () => {
      expect(formatMonth("2024-06")).toBe("June 2024");
      expect(formatMonth("2023-12")).toBe("December 2023");
    });
  });

  describe("migrateLegacyBudgets", () => {
    it("should migrate legacy budget format to new format", () => {
      const legacyBudgets = {
        1: 500,
        2: 300,
        3: 400,
      };
      const currentMonth = "2024-01";
      const migratedBudgets = migrateLegacyBudgets(legacyBudgets, currentMonth);

      expect(migratedBudgets).toHaveLength(3);
      expect(migratedBudgets[0]).toEqual({
        id: "1-2024-01",
        categoryId: "1",
        amount: 500,
        month: "2024-01",
        rollover: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should use current month when no month provided", () => {
      const legacyBudgets = { 1: 500 };
      const migratedBudgets = migrateLegacyBudgets(legacyBudgets);
      const currentMonth = getCurrentMonth();

      expect(migratedBudgets[0].month).toBe(currentMonth);
      expect(migratedBudgets[0].id).toBe(`1-${currentMonth}`);
    });

    it("should handle invalid amounts", () => {
      const legacyBudgets = { 1: "invalid", 2: null, 3: 500 };
      const migratedBudgets = migrateLegacyBudgets(legacyBudgets, "2024-01");

      expect(migratedBudgets[0].amount).toBe(0);
      expect(migratedBudgets[1].amount).toBe(0);
      expect(migratedBudgets[2].amount).toBe(500);
    });
  });

  describe("validateBudget", () => {
    it("should validate a correct budget object", () => {
      const validBudget = {
        id: "1-2024-01",
        categoryId: "1",
        amount: 500,
        month: "2024-01",
        rollover: false,
      };
      const validation = validateBudget(validBudget);
      expect(validation.isValid).toBe(true);
    });

    it("should reject invalid budget object", () => {
      const validation = validateBudget(null);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Invalid budget object");
    });

    it("should reject budget without id", () => {
      const invalidBudget = {
        categoryId: "1",
        amount: 500,
        month: "2024-01",
        rollover: false,
      };
      const validation = validateBudget(invalidBudget);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Invalid budget ID");
    });

    it("should reject budget without categoryId", () => {
      const invalidBudget = {
        id: "1-2024-01",
        amount: 500,
        month: "2024-01",
        rollover: false,
      };
      const validation = validateBudget(invalidBudget);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Invalid category ID");
    });

    it("should reject budget with negative amount", () => {
      const invalidBudget = {
        id: "1-2024-01",
        categoryId: "1",
        amount: -100,
        month: "2024-01",
        rollover: false,
      };
      const validation = validateBudget(invalidBudget);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Invalid budget amount");
    });

    it("should reject budget with invalid month format", () => {
      const invalidBudget = {
        id: "1-2024-01",
        categoryId: "1",
        amount: 500,
        month: "2024/01",
        rollover: false,
      };
      const validation = validateBudget(invalidBudget);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Invalid month format (YYYY-MM)");
    });
  });

  describe("getBudgetForCategory", () => {
    it("should find budget for specific category and month", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
        { id: "2", categoryId: "2", amount: 300, month: "2024-01" },
        { id: "3", categoryId: "1", amount: 600, month: "2024-02" },
      ];

      const budget = getBudgetForCategory(budgets, "1", "2024-01");
      expect(budget).toEqual({
        id: "1",
        categoryId: "1",
        amount: 500,
        month: "2024-01",
      });
    });

    it("should return null when budget not found", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
      ];

      const budget = getBudgetForCategory(budgets, "2", "2024-01");
      expect(budget).toBeNull();
    });
  });

  describe("getBudgetsForMonth", () => {
    it("should return all budgets for a specific month", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
        { id: "2", categoryId: "2", amount: 300, month: "2024-01" },
        { id: "3", categoryId: "1", amount: 600, month: "2024-02" },
      ];

      const monthBudgets = getBudgetsForMonth(budgets, "2024-01");
      expect(monthBudgets).toHaveLength(2);
      expect(monthBudgets[0].month).toBe("2024-01");
      expect(monthBudgets[1].month).toBe("2024-01");
    });

    it("should return empty array when no budgets for month", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
      ];

      const monthBudgets = getBudgetsForMonth(budgets, "2024-02");
      expect(monthBudgets).toEqual([]);
    });
  });

  describe("getTotalBudgetForMonth", () => {
    it("should calculate total budget amount for a month", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
        { id: "2", categoryId: "2", amount: 300, month: "2024-01" },
        { id: "3", categoryId: "3", amount: 200, month: "2024-01" },
        { id: "4", categoryId: "1", amount: 600, month: "2024-02" },
      ];

      const total = getTotalBudgetForMonth(budgets, "2024-01");
      expect(total).toBe(1000);
    });

    it("should return 0 when no budgets for month", () => {
      const budgets = [
        { id: "1", categoryId: "1", amount: 500, month: "2024-01" },
      ];

      const total = getTotalBudgetForMonth(budgets, "2024-02");
      expect(total).toBe(0);
    });
  });
});
