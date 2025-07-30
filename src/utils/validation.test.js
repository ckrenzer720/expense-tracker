import { describe, it, expect } from "vitest";
import { validateExpense, validateAmount, validateDate } from "./validation.js";

describe("Validation Utilities", () => {
  describe("validateExpense", () => {
    it("should validate a correct expense object", () => {
      const validExpense = {
        amount: 100,
        category: "food",
        date: "2024-01-15",
      };

      const result = validateExpense(validExpense);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should reject expense with invalid amount", () => {
      const invalidExpense = {
        amount: 0,
        category: "food",
        date: "2024-01-15",
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBe("Amount must be greater than 0");
    });

    it("should reject expense with negative amount", () => {
      const invalidExpense = {
        amount: -50,
        category: "food",
        date: "2024-01-15",
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBe("Amount must be greater than 0");
    });

    it("should reject expense without category", () => {
      const invalidExpense = {
        amount: 100,
        date: "2024-01-15",
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe("Please select a category");
    });

    it("should reject expense without date", () => {
      const invalidExpense = {
        amount: 100,
        category: "food",
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors.date).toBe("Please select a date");
    });

    it("should collect multiple errors", () => {
      const invalidExpense = {
        amount: 0,
        // missing category and date
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        amount: "Amount must be greater than 0",
        category: "Please select a category",
        date: "Please select a date",
      });
    });

    it("should handle expense with null/undefined values", () => {
      const invalidExpense = {
        amount: null,
        category: undefined,
        date: "",
      };

      const result = validateExpense(invalidExpense);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBe("Amount must be greater than 0");
      expect(result.errors.category).toBe("Please select a category");
      expect(result.errors.date).toBe("Please select a date");
    });
  });

  describe("validateAmount", () => {
    it("should validate correct amount", () => {
      expect(validateAmount(100)).toBeNull();
      expect(validateAmount(100.5)).toBeNull();
      expect(validateAmount(0.01)).toBeNull();
    });

    it("should reject zero amount", () => {
      expect(validateAmount(0)).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject negative amount", () => {
      expect(validateAmount(-50)).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject null amount", () => {
      expect(validateAmount(null)).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject undefined amount", () => {
      expect(validateAmount(undefined)).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject empty string", () => {
      expect(validateAmount("")).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject non-numeric string", () => {
      expect(validateAmount("abc")).toBe(
        "Please enter a valid amount greater than 0"
      );
    });

    it("should reject NaN", () => {
      expect(validateAmount(NaN)).toBe(
        "Please enter a valid amount greater than 0"
      );
    });
  });

  describe("validateDate", () => {
    it("should validate correct date", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(validateDate(today)).toBeNull();
    });

    it("should reject null date", () => {
      expect(validateDate(null)).toBe("Please select a date");
    });

    it("should reject undefined date", () => {
      expect(validateDate(undefined)).toBe("Please select a date");
    });

    it("should reject empty string", () => {
      expect(validateDate("")).toBe("Please select a date");
    });

    it("should reject date before 2020", () => {
      expect(validateDate("2019-12-31")).toBe("Date cannot be before 2020");
      expect(validateDate("2015-06-15")).toBe("Date cannot be before 2020");
    });

    it("should accept date in 2020", () => {
      expect(validateDate("2020-01-01")).toBeNull();
      expect(validateDate("2020-12-31")).toBeNull();
    });

    it("should reject date more than 1 year in the future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      const futureDateString = futureDate.toISOString().split("T")[0];

      expect(validateDate(futureDateString)).toBe(
        "Date cannot be more than 1 year in the future"
      );
    });

    it("should accept date up to 1 year in the future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split("T")[0];

      expect(validateDate(futureDateString)).toBeNull();
    });

    it("should handle different date formats", () => {
      // These should all be valid if they represent the same date
      const today = new Date();
      const todayString = today.toISOString().split("T")[0];

      expect(validateDate(todayString)).toBeNull();
      expect(validateDate(today.toISOString())).toBeNull();
    });

    it("should handle edge cases around year boundary", () => {
      // Test around the 2020 boundary
      expect(validateDate("2019-12-31")).toBe("Date cannot be before 2020");
      expect(validateDate("2020-01-01")).toBeNull();

      // Test around the future boundary
      const currentYear = new Date().getFullYear();
      const yearAfterNext = currentYear + 2;

      // Use a date that is exactly 1 year in the future
      const today = new Date();
      const exactlyOneYearFromNow = new Date(today);
      exactlyOneYearFromNow.setFullYear(today.getFullYear() + 1);
      const exactlyOneYearString = exactlyOneYearFromNow
        .toISOString()
        .split("T")[0];

      expect(validateDate(exactlyOneYearString)).toBeNull();
      expect(validateDate(`${yearAfterNext}-01-01`)).toBe(
        "Date cannot be more than 1 year in the future"
      );
    });
  });
});
