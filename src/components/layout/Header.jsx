import React from "react";

const Header = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "expenses", label: "Expenses" },
    { id: "budgets", label: "Budgets" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Expense Tracker</h1>
        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${
                currentView === item.id ? "nav-button--active" : ""
              }`}
              onClick={() => setCurrentView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
