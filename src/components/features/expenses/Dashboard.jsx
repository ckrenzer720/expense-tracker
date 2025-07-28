import React from "react";
import { useExpense } from "../../../hooks";
import {
  formatCurrency,
  calculateTotal,
  getCurrentMonthExpenses,
} from "../../../utils";
import { Card, Button, LoadingSkeleton } from "../../common";

const Dashboard = () => {
  const { expenses, categories, loading, error } = useExpense();
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpent = calculateTotal(currentMonthExpenses);
  const recentExpenses = expenses.slice(0, 5);

  const getCategoryDisplayName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryDisplayIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "📝";
  };

  const handleViewAllExpenses = () => {
    window.location.reload(); // This will be replaced with navigation
  };

  // Show loading state while data is being loaded
  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's your financial overview.</p>
        </div>

        <div className="dashboard-stats">
          <Card title="This Month" className="stat-card">
            <LoadingSkeleton type="card" />
          </Card>

          <Card title="Expenses" className="stat-card">
            <LoadingSkeleton type="card" />
          </Card>

          <Card title="Budget" className="stat-card">
            <LoadingSkeleton type="card" />
          </Card>
        </div>

        <div className="dashboard-content">
          <Card title="Recent Expenses" className="recent-expenses">
            <LoadingSkeleton type="expense-item" count={3} />
          </Card>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's your financial overview.</p>
        </div>

        <div className="dashboard-content">
          <Card>
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Failed to Load Dashboard
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      <div className="dashboard-stats">
        <Card title="This Month" className="stat-card">
          <div className="stat-value">{formatCurrency(totalSpent)}</div>
          <div className="stat-label">Total Spent</div>
        </Card>

        <Card title="Expenses" className="stat-card">
          <div className="stat-value">{currentMonthExpenses.length}</div>
          <div className="stat-label">This Month</div>
        </Card>

        <Card title="Budget" className="stat-card">
          <div className="stat-value">{formatCurrency(2000 - totalSpent)}</div>
          <div className="stat-label">Remaining</div>
        </Card>
      </div>

      <div className="dashboard-content">
        <Card title="Recent Expenses" className="recent-expenses">
          {recentExpenses.length === 0 ? (
            <p className="no-expenses">
              No expenses yet. Add your first expense to get started!
            </p>
          ) : (
            <div className="expense-list">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-icon">
                    {getCategoryDisplayIcon(expense.category)}
                  </div>
                  <div className="expense-details">
                    <div className="expense-category">
                      {getCategoryDisplayName(expense.category)}
                    </div>
                    <div className="expense-notes">
                      {expense.notes || "No notes"}
                    </div>
                    <div className="expense-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="expense-amount">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="view-all-container">
            <Button
              variant="secondary"
              size="small"
              onClick={handleViewAllExpenses}
            >
              View All Expenses
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
