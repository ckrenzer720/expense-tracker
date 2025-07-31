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
  switch (action.type) {
    case "EXPENSE_ADD":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case "EXPENSE_UPDATE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case "EXPENSE_DELETE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    case "EXPENSES_SET":
      return {
        ...state,
        expenses: action.payload,
      };
    case "BUDGETS_SET":
      return {
        ...state,
        budgets: action.payload,
      };
    case "BUDGET_UPDATE":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case "BUDGET_ADD":
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case "CURRENT_MONTH_SET":
      return {
        ...state,
        currentMonth: action.payload,
      };
    case "LOADING_SET":
      return {
        ...state,
        loading: action.payload,
      };
    case "ERROR_SET":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadExpenses = () => {
      try {
        dispatch({ type: "LOADING_SET", payload: true });

        const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (savedExpenses) {
          const parsedExpenses = JSON.parse(savedExpenses);

          // Validate each expense
          const validExpenses = parsedExpenses.filter((expense) => {
            const validation = validateData(expense, "expense");
            if (!validation.isValid) {
              logError(new Error(`Invalid expense data: ${validation.error}`), {
                component: "ExpenseProvider",
                action: "loadExpenses",
                data: expense,
              });
              return false;
            }
            return true;
          });

          dispatch({ type: "EXPENSES_SET", payload: validExpenses });
        }
      } catch (error) {
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
        localStorage.setItem(
          STORAGE_KEYS.EXPENSES,
          JSON.stringify(state.expenses)
        );
      } catch (error) {
        logError(error, {
          component: "ExpenseProvider",
          action: "saveExpenses",
        });

        // Attempt recovery
        attemptRecovery(error, "localStorage");
      }
    };

    if (
      state.expenses.length > 0 ||
      localStorage.getItem(STORAGE_KEYS.EXPENSES)
    ) {
      saveExpenses();
    }
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

    if (state.budgets.length > 0) {
      saveBudgets();
    }
  }, [state.budgets]);

  const createExpense = (expenseData) => {
    try {
      const validation = validateData(expenseData, "expense");
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const newExpense = {
        ...validation.data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: "EXPENSE_ADD", payload: newExpense });
    } catch (error) {
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
