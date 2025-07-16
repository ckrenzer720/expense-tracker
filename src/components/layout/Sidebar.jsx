import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { ExpenseFormModal } from "../features/expenses";
import { ROUTES } from "../../constants/routes";

const Sidebar = ({ setCurrentView }) => {
  const { categories, expenses, budgets } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleOpenExpenseModal = () => {
    setIsModalOpen(true);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentView(ROUTES.EXPENSES);
  };

  const getCategoryExpenseCount = (categoryId) => {
    return expenses.filter((expense) => expense.category === categoryId).length;
  };

  const getCategoryTotalSpent = (categoryId) => {
    return expenses
      .filter((expense) => expense.category === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudgetAmount = () => {
    return Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  };

  const getTotalSpentAmount = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalRemainingAmount = () => {
    return getTotalBudgetAmount() - getTotalSpentAmount();
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3>Quick Add</h3>
          <button className="add-expense-btn" onClick={handleOpenExpenseModal}>
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
                  activeCategory === category.id ? "category-item--active" : ""
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  ({getCategoryExpenseCount(category.id)})
                </span>
                <span className="category-total">
                  ${getCategoryTotalSpent(category.id).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Budget Overview</h3>
          <div className="budget-summary">
            <p>Monthly Budget: ${getTotalBudgetAmount().toFixed(2)}</p>
            <p>Spent: ${getTotalSpentAmount().toFixed(2)}</p>
            <p>Remaining: ${getTotalRemainingAmount().toFixed(2)}</p>
          </div>
        </div>
      </aside>

      {isModalOpen && (
        <ExpenseFormModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setCurrentView(ROUTES.EXPENSES);
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
