import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { AddExpenseModal } from "../features/expenses";
import { ROUTES } from "../../constants/routes";

const Sidebar = ({ setCurrentView }) => {
  const { categories, expenses, budgets } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddExpense = () => {
    setShowAddModal(true);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView(ROUTES.EXPENSES);
  };

  const getCategoryExpenseCount = (categoryId) => {
    return expenses.filter((expense) => expense.category === categoryId).length;
  };

  const getCategoryTotal = (categoryId) => {
    return expenses
      .filter((expense) => expense.category === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudget = () => {
    return Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  };

  const getTotalSpent = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalRemaining = () => {
    return getTotalBudget() - getTotalSpent();
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3>Quick Add</h3>
          <button className="add-expense-btn" onClick={handleAddExpense}>
            + Add Expense
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li
                key={category.id}
                className={`category-item ${
                  selectedCategory === category.id
                    ? "category-item--active"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  ({getCategoryExpenseCount(category.id)})
                </span>
                <span className="category-total">
                  ${getCategoryTotal(category.id).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Budget Overview</h3>
          <div className="budget-summary">
            <p>Monthly Budget: ${getTotalBudget().toFixed(2)}</p>
            <p>Spent: ${getTotalSpent().toFixed(2)}</p>
            <p>Remaining: ${getTotalRemaining().toFixed(2)}</p>
          </div>
        </div>
      </aside>

      {showAddModal && (
        <AddExpenseModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setCurrentView(ROUTES.EXPENSES);
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
