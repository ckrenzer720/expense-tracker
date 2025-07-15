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
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload,
      };
    case "SET_BUDGETS":
      return {
        ...state,
        budgets: action.payload,
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.categoryId]: action.payload.amount,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
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
        dispatch({ type: "SET_EXPENSES", payload: expenses });
      } catch (error) {
        console.error("Error loading expenses:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load expenses" });
      }
    }
  }, []);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (savedBudgets) {
      try {
        const budgets = JSON.parse(savedBudgets);
        dispatch({ type: "SET_BUDGETS", payload: budgets });
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

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_EXPENSE", payload: newExpense });
  };

  const updateExpense = (expense) => {
    const updatedExpense = {
      ...expense,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });
  };

  const deleteExpense = (expenseId) => {
    dispatch({ type: "DELETE_EXPENSE", payload: expenseId });
  };

  const updateBudget = (categoryId, amount) => {
    dispatch({
      type: "UPDATE_BUDGET",
      payload: { categoryId, amount: parseFloat(amount) || 0 },
    });
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudget,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
