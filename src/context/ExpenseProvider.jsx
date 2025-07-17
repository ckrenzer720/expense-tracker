import React, { useReducer, useEffect } from "react";
import { ExpenseContext } from "./ExpenseContext";
import {
  EXPENSE_CATEGORIES,
  DEFAULT_BUDGETS,
  STORAGE_KEYS,
} from "../constants/categories";
import {
  logError,
  validateData,
  attemptRecovery,
} from "../utils/errorHandling";

const initialState = {
  expenses: [],
  categories: EXPENSE_CATEGORIES,
  budgets: DEFAULT_BUDGETS,
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
        budgets: {
          ...state.budgets,
          [action.payload.categoryId]: action.payload.amount,
        },
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
        const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
        if (savedBudgets) {
          const parsedBudgets = JSON.parse(savedBudgets);
          const validation = validateData(parsedBudgets, "budget");

          if (validation.isValid) {
            dispatch({ type: "BUDGETS_SET", payload: validation.data });
          } else {
            logError(new Error(`Invalid budget data: ${validation.error}`), {
              component: "ExpenseProvider",
              action: "loadBudgets",
            });
            // Keep default budgets if validation fails
          }
        }
      } catch (error) {
        logError(error, {
          component: "ExpenseProvider",
          action: "loadBudgets",
        });
        // Keep default budgets if loading fails
      }
    };

    loadBudgets();
  }, []);

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
        localStorage.setItem(
          STORAGE_KEYS.BUDGETS,
          JSON.stringify(state.budgets)
        );
      } catch (error) {
        logError(error, {
          component: "ExpenseProvider",
          action: "saveBudgets",
        });

        // Attempt recovery
        attemptRecovery(error, "localStorage");
      }
    };

    saveBudgets();
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

  const setBudget = (categoryId, amount) => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount < 0) {
        throw new Error("Invalid budget amount");
      }

      dispatch({
        type: "BUDGET_UPDATE",
        payload: { categoryId, amount: numericAmount },
      });
    } catch (error) {
      logError(error, {
        component: "ExpenseProvider",
        action: "setBudget",
        data: { categoryId, amount },
      });
      throw error;
    }
  };

  const value = {
    ...state,
    createExpense,
    editExpense,
    removeExpense,
    setBudget,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
