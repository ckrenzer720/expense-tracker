import React, { useState } from "react";
import { useExpense } from "../../../hooks/useExpense";
import { formatCurrency } from "../../../utils/currency";
import { Card, Button, ErrorBoundary } from "../../common";
import ExpenseFormModal from "./ExpenseFormModal";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "../../../constants/routes";

const Expenses = () => {
  const { expenses, categories, removeExpense } = useExpense();
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
