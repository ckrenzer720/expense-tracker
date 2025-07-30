import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  calculateTotal,
  calculateTotalByCategory,
  getCurrentMonthExpenses,
} from "./currency.js";

describe("Currency Utilities", () => {
  describe("formatCurrency", () => {
    it("should format USD currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });

    it("should handle different currencies", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
      expect(formatCurrency(1234.56, "GBP")).toBe("£1,234.56");
    });

    it("should handle negative amounts", () => {
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });

    it("should handle decimal precision", () => {
      expect(formatCurrency(1234.5)).toBe("$1,234.50");
      expect(formatCurrency(1234.567)).toBe("$1,234.57"); // Rounds up
    });
  });

  describe("calculateTotal", () => {
    it("should calculate total of all expenses", () => {
      const expenses = [
        { id: "1", amount: 100, category: "food" },
        { id: "2", amount: 200, category: "transport" },
        { id: "3", amount: 300, category: "entertainment" },
      ];

      expect(calculateTotal(expenses)).toBe(600);
    });

    it("should return 0 for empty expenses array", () => {
      expect(calculateTotal([])).toBe(0);
    });

    it("should handle single expense", () => {
      const expenses = [{ id: "1", amount: 150, category: "food" }];
      expect(calculateTotal(expenses)).toBe(150);
    });

    it("should handle expenses with decimal amounts", () => {
      const expenses = [
        { id: "1", amount: 100.5, category: "food" },
        { id: "2", amount: 200.25, category: "transport" },
      ];
      expect(calculateTotal(expenses)).toBe(300.75);
    });
  });

  describe("calculateTotalByCategory", () => {
    it("should calculate total for specific category", () => {
      const expenses = [
        { id: "1", amount: 100, category: "food" },
        { id: "2", amount: 200, category: "transport" },
        { id: "3", amount: 150, category: "food" },
        { id: "4", amount: 300, category: "entertainment" },
      ];

      expect(calculateTotalByCategory(expenses, "food")).toBe(250);
    });

    it("should return 0 for category with no expenses", () => {
      const expenses = [
        { id: "1", amount: 100, category: "food" },
        { id: "2", amount: 200, category: "transport" },
      ];

      expect(calculateTotalByCategory(expenses, "entertainment")).toBe(0);
    });

    it("should return 0 for empty expenses array", () => {
      expect(calculateTotalByCategory([], "food")).toBe(0);
    });

    it("should handle case-sensitive category matching", () => {
      const expenses = [
        { id: "1", amount: 100, category: "Food" },
        { id: "2", amount: 200, category: "food" },
      ];

      expect(calculateTotalByCategory(expenses, "food")).toBe(200);
      expect(calculateTotalByCategory(expenses, "Food")).toBe(100);
    });
  });

  describe("getCurrentMonthExpenses", () => {
    it("should return expenses for current month", () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const expenses = [
        {
          id: "1",
          amount: 100,
          category: "food",
          date: new Date(currentYear, currentMonth, 15).toISOString(),
        },
        {
          id: "2",
          amount: 200,
          category: "transport",
          date: new Date(currentYear, currentMonth, 20).toISOString(),
        },
        {
          id: "3",
          amount: 300,
          category: "entertainment",
          date: new Date(currentYear, currentMonth - 1, 15).toISOString(), // Previous month
        },
      ];

      const currentMonthExpenses = getCurrentMonthExpenses(expenses);
      expect(currentMonthExpenses).toHaveLength(2);
      expect(currentMonthExpenses[0].id).toBe("1");
      expect(currentMonthExpenses[1].id).toBe("2");
    });

    it("should return empty array when no expenses in current month", () => {
      const now = new Date();
      const previousMonth = now.getMonth() - 1;
      const currentYear = now.getFullYear();

      const expenses = [
        {
          id: "1",
          amount: 100,
          category: "food",
          date: new Date(currentYear, previousMonth, 15).toISOString(),
        },
      ];

      const currentMonthExpenses = getCurrentMonthExpenses(expenses);
      expect(currentMonthExpenses).toEqual([]);
    });

    it("should handle year boundary correctly", () => {
      const expenses = [
        {
          id: "1",
          amount: 100,
          category: "food",
          date: new Date(2023, 11, 31).toISOString(), // December 31, 2023
        },
        {
          id: "2",
          amount: 200,
          category: "transport",
          date: new Date(2024, 0, 1).toISOString(), // January 1, 2024
        },
      ];

      // Mock current date to January 2024
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new originalDate(2024, 0, 15); // January 15, 2024
          }
          return new originalDate(...args);
        }
      };

      const currentMonthExpenses = getCurrentMonthExpenses(expenses);
      expect(currentMonthExpenses).toHaveLength(1);
      expect(currentMonthExpenses[0].id).toBe("2");

      // Restore original Date
      global.Date = originalDate;
    });

    it("should return empty array for empty expenses", () => {
      expect(getCurrentMonthExpenses([])).toEqual([]);
    });
  });
});
