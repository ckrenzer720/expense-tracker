import React, { useState } from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import Expenses from "./components/pages/Expenses";
import Budgets from "./components/pages/Budgets";
import Analytics from "./components/pages/Analytics";
import "./index.css";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "expenses":
        return <Expenses />;
      case "budgets":
        return <Budgets />;
      case "analytics":
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
