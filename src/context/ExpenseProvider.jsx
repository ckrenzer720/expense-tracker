import React, { useReducer, useEffect } from "react";
import { ExpenseContext } from "./ExpenseContext";
import {
  EXPENSE_CATEGORIES,
  DEFAULT_BUDGETS,
  STORAGE_KEYS,
} from "../constants/categories";

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
    const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        dispatch({ type: "EXPENSES_SET", payload: expenses });
      } catch (error) {
        console.error("Error loading expenses:", error);
        dispatch({ type: "ERROR_SET", payload: "Failed to load expenses" });
      }
    }
  }, []);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (savedBudgets) {
      try {
        const budgets = JSON.parse(savedBudgets);
        dispatch({ type: "BUDGETS_SET", payload: budgets });
      } catch (error) {
        console.error("Error loading budgets:", error);
        // Keep default budgets if loading fails
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(state.expenses));
  }, [state.expenses]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
  }, [state.budgets]);

  const createExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "EXPENSE_ADD", payload: newExpense });
  };

  const editExpense = (expenseData) => {
    const updatedExpense = {
      ...expenseData,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "EXPENSE_UPDATE", payload: updatedExpense });
  };

  const removeExpense = (expenseId) => {
    dispatch({ type: "EXPENSE_DELETE", payload: expenseId });
  };

  const setBudget = (categoryId, amount) => {
    dispatch({
      type: "BUDGET_UPDATE",
      payload: { categoryId, amount: parseFloat(amount) || 0 },
    });
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
