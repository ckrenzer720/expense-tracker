import React, { useReducer, useEffect } from "react";
import { ExpenseContext } from "./ExpenseContext";

const initialState = {
  expenses: [],
  categories: [
    { id: "1", name: "Food & Dining", color: "#10B981", icon: "🍽️" },
    { id: "2", name: "Transportation", color: "#3B82F6", icon: "🚗" },
    { id: "3", name: "Shopping", color: "#8B5CF6", icon: "🛍️" },
    { id: "4", name: "Entertainment", color: "#F59E0B", icon: "🎬" },
    { id: "5", name: "Utilities", color: "#EF4444", icon: "⚡" },
    { id: "6", name: "Healthcare", color: "#06B6D4", icon: "🏥" },
    { id: "7", name: "Education", color: "#84CC16", icon: "📚" },
    { id: "8", name: "Other", color: "#6B7280", icon: "📝" },
  ],
  budgets: [],
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
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        dispatch({ type: "SET_EXPENSES", payload: expenses });
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

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

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
