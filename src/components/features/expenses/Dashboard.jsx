import React from "react";
import { useExpense } from "../../../hooks/useExpense";
import {
  formatCurrency,
  calculateTotal,
  getCurrentMonthExpenses,
} from "../../../utils/currency";
import { Card, Button } from "../../common";

const Dashboard = () => {
  const { expenses, categories } = useExpense();
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpent = calculateTotal(currentMonthExpenses);
  const recentExpenses = expenses.slice(0, 5);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "📝";
  };

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
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="expense-details">
                    <div className="expense-category">
                      {getCategoryName(expense.category)}
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
              onClick={() => window.location.reload()} // This will be replaced with navigation
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
