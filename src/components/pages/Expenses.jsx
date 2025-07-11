import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { formatCurrency } from "../../utils/currency";
import Card from "../ui/Card";
import Button from "../ui/Button";
import AddExpenseModal from "../forms/AddExpenseModal";

const Expenses = () => {
  const { expenses, categories, deleteExpense } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "📝";
  };

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === filterCategory);

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(expenseId);
    }
  };

  return (
    <div className="container">
      <div className="expenses-header">
        <div>
          <h2>Expenses</h2>
          <p>Manage and track your expenses</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Expense</Button>
      </div>

      <div className="expenses-filters">
        <Card className="filter-card">
          <div className="filter-group">
            <label htmlFor="category-filter">Filter by Category:</label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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
              <Button onClick={() => setShowAddModal(true)}>
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

      {showAddModal && (
        <AddExpenseModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Expenses;
