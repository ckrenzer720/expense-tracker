import React, { useState } from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import {
  Header,
  Sidebar,
  Dashboard,
  Expenses,
  Budgets,
  Analytics,
  ErrorBoundary,
  ErrorTestComponent,
} from "./components";
import { ROUTES } from "./constants/routes";

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

  const handleGoBack = () => {
    setCurrentView(ROUTES.DASHBOARD);
  };

  return (
    <ExpenseProvider>
      <ErrorBoundary showDetails={import.meta.env.DEV} onGoBack={handleGoBack}>
        <div className="app">
          <Header currentView={currentView} setCurrentView={setCurrentView} />
          <div className="main-container">
            <Sidebar setCurrentView={setCurrentView} />
            <main className="main">{renderCurrentView()}</main>
          </div>
        </div>

        {/* Hidden developer tool - only appears with Ctrl+Shift+E */}
        <ErrorTestComponent />
      </ErrorBoundary>
    </ExpenseProvider>
  );
}

export default App;
