import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import AddExpense from "../forms/AddExpenseModal";

const Sidebar = ({ setCurrentView }) => {
  const { categories, expenses } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddExpense = () => {
    setShowAddModal(true);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView("expenses");
  };

  const getCategoryExpenseCount = (categoryId) => {
    return expenses.filter((expense) => expense.category === categoryId).length;
  };

  const getCategoryTotal = (categoryId) => {
    return expenses
      .filter((expense) => expense.category === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
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
            <p>Monthly Budget: $2,000</p>
            <p>Spent: $1,250</p>
            <p>Remaining: $750</p>
          </div>
        </div>
      </aside>

      {showAddModal && (
        <AddExpense
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setCurrentView("expenses");
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
