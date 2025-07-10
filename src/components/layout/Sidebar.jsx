import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Quick Add</h3>
        <button className="add-expense-btn">+ Add Expense</button>
      </div>

      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          <li>Food & Dining</li>
          <li>Transportation</li>
          <li>Shopping</li>
          <li>Entertainment</li>
          <li>Utilities</li>
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
  );
};

export default Sidebar;
