import React, { useCallback } from "react";
import { NAV_ITEMS } from "../../constants";

const Header = ({ currentView, setCurrentView }) => {
  const handleKeyDown = useCallback(
    (event, itemId) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setCurrentView(itemId);
      }
    },
    [setCurrentView]
  );

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <h1 className="header-title">Expense Tracker</h1>
        <nav
          className="header-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${
                currentView === item.id ? "nav-button--active" : ""
              }`}
              onClick={() => setCurrentView(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-current={currentView === item.id ? "page" : undefined}
              aria-label={`Navigate to ${item.label}`}
              tabIndex={0}
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
