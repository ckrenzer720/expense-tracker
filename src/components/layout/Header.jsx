import React from "react";
import { NAV_ITEMS } from "../../constants/routes";

const Header = ({ currentView, setCurrentView }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Expense Tracker</h1>
        <nav className="header-nav">
          {NAV_ITEMS.map((item) => (
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
