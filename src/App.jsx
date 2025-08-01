import React, { useState, Suspense, lazy } from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import {
  Header,
  Sidebar,
  ErrorBoundary,
  ErrorTestComponent,
} from "./components";
import { LoadingSpinner } from "./components/common";
import { ROUTES } from "./constants";

// Lazy load components for code splitting
const Dashboard = lazy(
  () => import("./components/features/expenses/Dashboard")
);
const Expenses = lazy(() => import("./components/features/expenses/Expenses"));
const BudgetPage = lazy(
  () => import("./components/features/budgets/BudgetPage")
);
const Analytics = lazy(
  () => import("./components/features/analytics/Analytics")
);

function App() {
  const [currentView, setCurrentView] = useState(ROUTES.DASHBOARD);

  const renderCurrentView = () => {
    switch (currentView) {
      case ROUTES.DASHBOARD:
        return <Dashboard />;
      case ROUTES.EXPENSES:
        return <Expenses />;
      case ROUTES.BUDGETS:
        return <BudgetPage />;
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
            <main className="main">
              <Suspense fallback={<LoadingSpinner />}>
                {renderCurrentView()}
              </Suspense>
            </main>
          </div>
        </div>

        {/* Hidden developer tool - only appears with Ctrl+Shift+E */}
        <ErrorTestComponent />
      </ErrorBoundary>
    </ExpenseProvider>
  );
}

export default App;
