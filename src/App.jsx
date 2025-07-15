import React, { useState } from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import {
  Header,
  Sidebar,
  Dashboard,
  Expenses,
  Budgets,
  Analytics,
} from "./components";
import { ROUTES } from "./constants/routes";
import "./index.css";

function App() {
  const [currentView, setCurrentView] = useState(ROUTES.DASHBOARD);

  const renderCurrentView = () => {
    switch (currentView) {
      case ROUTES.DASHBOARD:
        return <Dashboard />;
      case ROUTES.EXPENSES:
        return <Expenses />;
      case ROUTES.BUDGETS:
        return <Budgets />;
      case ROUTES.ANALYTICS:
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ExpenseProvider>
      <div className="app">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <div className="main-container">
          <Sidebar setCurrentView={setCurrentView} />
          <main className="main">{renderCurrentView()}</main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
