import React, { useReducer, useEffect } from "react";
import { ExpenseContext } from "./ExpenseContext";
import {
  EXPENSE_CATEGORIES,
  DEFAULT_BUDGETS,
  STORAGE_KEYS,
} from "../constants";
import { logError, validateData, attemptRecovery } from "../utils";
import {
  loadBudgetsFromStorage,
  saveBudgetsToStorage,
  createBudgetsForMonth,
  getCurrentMonth,
  getBudgetForCategory,
  getBudgetsForMonth,
  getTotalBudgetForMonth,
} from "../utils";

const initialState = {
  expenses: [],
  categories: EXPENSE_CATEGORIES,
  budgets: [], // Changed from object to array
  currentMonth: getCurrentMonth(),
  loading: false,
  error: null,
};

const expenseReducer = (state, action) => {
  console.log(
    "Expense reducer called with action:",
    action.type,
    action.payload
  );
  console.log("Current state:", state);

  let newState;

  switch (action.type) {
    case "EXPENSE_ADD":
      newState = {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
      console.log("New state after EXPENSE_ADD:", newState);
      return newState;
    case "EXPENSE_UPDATE":
      newState = {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
      console.log("New state after EXPENSE_UPDATE:", newState);
      return newState;
    case "EXPENSE_DELETE":
      newState = {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
      console.log("New state after EXPENSE_DELETE:", newState);
      return newState;
    case "EXPENSES_SET":
      newState = {
        ...state,
        expenses: action.payload,
      };
      console.log("New state after EXPENSES_SET:", newState);
      return newState;
    case "BUDGETS_SET":
      newState = {
        ...state,
        budgets: action.payload,
      };
      console.log("New state after BUDGETS_SET:", newState);
      return newState;
    case "BUDGET_UPDATE":
      newState = {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
      console.log("New state after BUDGET_UPDATE:", newState);
      return newState;
    case "BUDGET_ADD":
      newState = {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
      console.log("New state after BUDGET_ADD:", newState);
      return newState;
    case "CURRENT_MONTH_SET":
      newState = {
        ...state,
        currentMonth: action.payload,
      };
      console.log("New state after CURRENT_MONTH_SET:", newState);
      return newState;
    case "LOADING_SET":
      newState = {
        ...state,
        loading: action.payload,
      };
      console.log("New state after LOADING_SET:", newState);
      return newState;
    case "ERROR_SET":
      newState = {
        ...state,
        error: action.payload,
      };
      console.log("New state after ERROR_SET:", newState);
      return newState;
    default:
      console.log("Unknown action type:", action.type);
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadExpenses = () => {
      try {
        console.log("=== Loading expenses from localStorage ===");
        dispatch({ type: "LOADING_SET", payload: true });

        // Check if localStorage is available
        if (typeof localStorage === "undefined") {
          console.warn("localStorage is not available");
          dispatch({ type: "EXPENSES_SET", payload: [] });
          return;
        }

        const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        console.log("Raw saved expenses from localStorage:", savedExpenses);

        if (savedExpenses) {
          const parsedExpenses = JSON.parse(savedExpenses);
          console.log("Parsed expenses:", parsedExpenses);

          // Validate each expense
          const validExpenses = parsedExpenses.filter((expense) => {
            console.log("Validating expense:", expense);
            const validation = validateData(expense, "expense");
            console.log("Validation result for expense:", validation);

            if (!validation.isValid) {
              console.error("Invalid expense data:", validation.error);
              logError(new Error(`Invalid expense data: ${validation.error}`), {
                component: "ExpenseProvider",
                action: "loadExpenses",
                data: expense,
              });
              return false;
            }
            return true;
          });

          console.log("Valid expenses after validation:", validExpenses);
          dispatch({ type: "EXPENSES_SET", payload: validExpenses });
        } else {
          console.log("No saved expenses found in localStorage");
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
        logError(error, {
          component: "ExpenseProvider",
          action: "loadExpenses",
        });

        // Attempt recovery
        if (attemptRecovery(error, "data")) {
          dispatch({ type: "EXPENSES_SET", payload: [] });
        } else {
          dispatch({ type: "ERROR_SET", payload: "Failed to load expenses" });
        }
      } finally {
        dispatch({ type: "LOADING_SET", payload: false });
      }
    };

    loadExpenses();
  }, []);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const loadBudgets = () => {
      try {
        // Use the new budget loading utility with migration support
        const loadedBudgets = loadBudgetsFromStorage();

        // Ensure we have budgets for the current month
        const currentMonth = getCurrentMonth();
        const updatedBudgets = createBudgetsForMonth(
          loadedBudgets,
          currentMonth,
          true, // Enable rollover
          state.expenses
        );

        dispatch({ type: "BUDGETS_SET", payload: updatedBudgets });
      } catch (error) {
        logError(error, {
          component: "ExpenseProvider",
          action: "loadBudgets",
        });

        // Create default budgets if loading fails
        const defaultBudgets = createBudgetsForMonth([], getCurrentMonth());
        dispatch({ type: "BUDGETS_SET", payload: defaultBudgets });
      }
    };

    loadBudgets();
  }, [state.expenses]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    const saveExpenses = () => {
      try {
        console.log("=== Saving expenses to localStorage ===");
        console.log("Current expenses state:", state.expenses);

        // Check if localStorage is available
        if (typeof localStorage === "undefined") {
          console.warn("localStorage is not available");
          return;
        }

        const expensesJson = JSON.stringify(state.expenses);
        console.log("Expenses JSON to save:", expensesJson);

        // Check if the data is too large for localStorage
        if (expensesJson.length > 5 * 1024 * 1024) {
          // 5MB limit
          console.warn("Expenses data is too large for localStorage");
          return;
        }

        localStorage.setItem(STORAGE_KEYS.EXPENSES, expensesJson);
        console.log("Expenses saved successfully to localStorage");

        // Verify the save worked
        const savedData = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        console.log(
          "Verification - data read back from localStorage:",
          savedData
        );
      } catch (error) {
        console.error("Error saving expenses:", error);
        logError(error, {
          component: "ExpenseProvider",
          action: "saveExpenses",
        });

        // Attempt recovery
        attemptRecovery(error, "localStorage");
      }
    };

    // Always save expenses to localStorage, even if the array is empty
    // This ensures that when all expenses are deleted, localStorage is properly cleared
    saveExpenses();
  }, [state.expenses]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    const saveBudgets = () => {
      try {
        // Use the new budget saving utility
        saveBudgetsToStorage(state.budgets);
      } catch (error) {
        logError(error, {
          component: "ExpenseProvider",
          action: "saveBudgets",
        });

        // Attempt recovery
        attemptRecovery(error, "localStorage");
      }
    };

    // Always save budgets to localStorage, even if the array is empty
    // This ensures that when all budgets are deleted, localStorage is properly cleared
    saveBudgets();
  }, [state.budgets]);

  const createExpense = (expenseData) => {
    try {
      console.log("Creating expense with data:", expenseData);
      const validation = validateData(expenseData, "expense");
      console.log("Validation result:", validation);

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const newExpense = {
        ...validation.data,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("New expense created:", newExpense);
      console.log("Current state before dispatch:", state);
      dispatch({ type: "EXPENSE_ADD", payload: newExpense });
      console.log("Expense dispatched to reducer");
    } catch (error) {
      console.error("Error creating expense:", error);
      logError(error, {
        component: "ExpenseProvider",
        action: "createExpense",
        data: expenseData,
      });
      throw error;
    }
  };

  const editExpense = (expenseData) => {
    try {
      const validation = validateData(expenseData, "expense");
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const updatedExpense = {
        ...validation.data,
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: "EXPENSE_UPDATE", payload: updatedExpense });
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "editExpense",
        data: expenseData,
      });
      throw error;
    }
  };

  const removeExpense = (expenseId) => {
    try {
      if (!expenseId) {
        throw new Error("Invalid expense ID");
      }

      dispatch({ type: "EXPENSE_DELETE", payload: expenseId });
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "removeExpense",
        data: { expenseId },
      });
      throw error;
    }
  };

  const setBudget = (categoryId, amount, month = null) => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount < 0) {
        throw new Error("Invalid budget amount");
      }

      const targetMonth = month || state.currentMonth;

      // Find existing budget for this category and month
      const existingBudget = getBudgetForCategory(
        state.budgets,
        categoryId,
        targetMonth
      );

      if (existingBudget) {
        // Update existing budget
        const updatedBudget = {
          ...existingBudget,
          amount: numericAmount,
          updatedAt: new Date().toISOString(),
        };

        dispatch({
          type: "BUDGET_UPDATE",
          payload: updatedBudget,
        });
      } else {
        // Create new budget
        const newBudget = {
          id: `${categoryId}-${targetMonth}`,
          categoryId,
          amount: numericAmount,
          month: targetMonth,
          rollover: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dispatch({
          type: "BUDGET_ADD",
          payload: newBudget,
        });
      }
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "setBudget",
        data: { categoryId, amount, month },
      });
      throw error;
    }
  };

  const setBudgetRollover = (categoryId, rollover, month = null) => {
    try {
      const targetMonth = month || state.currentMonth;
      const existingBudget = getBudgetForCategory(
        state.budgets,
        categoryId,
        targetMonth
      );

      if (existingBudget) {
        const updatedBudget = {
          ...existingBudget,
          rollover: Boolean(rollover),
          updatedAt: new Date().toISOString(),
        };

        dispatch({
          type: "BUDGET_UPDATE",
          payload: updatedBudget,
        });
      }
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "setBudgetRollover",
        data: { categoryId, rollover, month },
      });
      throw error;
    }
  };

  const setCurrentMonth = (month) => {
    try {
      dispatch({ type: "CURRENT_MONTH_SET", payload: month });

      // Ensure budgets exist for the new month
      const updatedBudgets = createBudgetsForMonth(
        state.budgets,
        month,
        true, // Enable rollover
        state.expenses
      );

      if (updatedBudgets.length !== state.budgets.length) {
        dispatch({ type: "BUDGETS_SET", payload: updatedBudgets });
      }
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "setCurrentMonth",
        data: { month },
      });
      throw error;
    }
  };

  const getBudgetForCategoryHelper = (categoryId, month = null) => {
    const targetMonth = month || state.currentMonth;
    return getBudgetForCategory(state.budgets, categoryId, targetMonth);
  };

  const getBudgetsForMonthHelper = (month = null) => {
    const targetMonth = month || state.currentMonth;
    return getBudgetsForMonth(state.budgets, targetMonth);
  };

  const getTotalBudgetForMonthHelper = (month = null) => {
    const targetMonth = month || state.currentMonth;
    return getTotalBudgetForMonth(state.budgets, targetMonth);
  };

  const value = {
    ...state,
    createExpense,
    editExpense,
    removeExpense,
    setBudget,
    setBudgetRollover,
    setCurrentMonth,
    getBudgetForCategory: getBudgetForCategoryHelper,
    getBudgetsForMonth: getBudgetsForMonthHelper,
    getTotalBudgetForMonth: getTotalBudgetForMonthHelper,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
