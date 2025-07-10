import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Expense Tracker</h1>
        <nav className="header-nav">
          <button className="nav-button">Dashboard</button>
          <button className="nav-button">Expenses</button>
          <button className="nav-button">Budgets</button>
          <button className="nav-button">Analytics</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
