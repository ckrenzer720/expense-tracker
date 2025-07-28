import React, { useState } from "react";
import { useExpense } from "../../../hooks";
import { formatCurrency } from "../../../utils";
import {
  Card,
  Button,
  ErrorBoundary,
  LoadingSpinner,
  LoadingSkeleton,
} from "../../common";
import ExpenseFormModal from "./ExpenseFormModal";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "../../../constants";

const Expenses = () => {
  const { expenses, categories, removeExpense, loading, error } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "📝";
  };

  const filteredExpenses =
    selectedCategoryFilter === "all"
      ? expenses
      : expenses.filter(
          (expense) => expense.category === selectedCategoryFilter
        );

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      removeExpense(expenseId);
    }
  };

  // Show loading state while data is being loaded
  if (loading) {
    return (
      <div className="container">
        <div className="expenses-header">
          <div>
            <h2>{PAGE_TITLES.expenses}</h2>
            <p>{PAGE_DESCRIPTIONS.expenses}</p>
          </div>
        </div>

        <div className="expenses-content">
          <Card title="Loading Expenses...">
            <LoadingSkeleton type="expense-item" count={5} />
          </Card>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="container">
        <div className="expenses-header">
          <div>
            <h2>{PAGE_TITLES.expenses}</h2>
            <p>{PAGE_DESCRIPTIONS.expenses}</p>
          </div>
        </div>

        <div className="expenses-content">
          <Card>
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Failed to Load Expenses
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      showDetails={import.meta.env.DEV}
      fallback={
        <div className="container">
          <div className="expenses-header">
            <div>
              <h2>{PAGE_TITLES.expenses}</h2>
              <p>{PAGE_DESCRIPTIONS.expenses}</p>
            </div>
          </div>
          <p>
            There was an issue loading your expenses. Please try refreshing the
            page.
          </p>
        </div>
      }
    >
      <div className="container">
        <div className="expenses-header">
          <div>
            <h2>{PAGE_TITLES.expenses}</h2>
            <p>{PAGE_DESCRIPTIONS.expenses}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ Add Expense</Button>
        </div>

        <div className="expenses-filters">
          <Card className="filter-card">
            <div className="filter-group">
              <label htmlFor="category-filter">Filter by Category:</label>
              <select
                id="category-filter"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        <div className="expenses-content">
          <Card title={`Expenses (${filteredExpenses.length})`}>
            {filteredExpenses.length === 0 ? (
              <div className="no-expenses">
                <p>No expenses found.</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  Add Your First Expense
                </Button>
              </div>
            ) : (
              <div className="expense-list">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-icon">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-details">
                      <div className="expense-category">
                        {getCategoryName(expense.category)}
                      </div>
                      <div className="expense-notes">
                        {expense.notes || "No notes"}
                      </div>
                      <div className="expense-date">
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="expense-amount">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div className="expense-actions">
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {isModalOpen && (
          <ExpenseFormModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Expenses;
