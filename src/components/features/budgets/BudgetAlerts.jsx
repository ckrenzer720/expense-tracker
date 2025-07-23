import React, { useMemo } from "react";
import { useExpense } from "../../../hooks/useExpense";
import {
  formatCurrency,
  calculateTotalByCategory,
  getCurrentMonthExpenses,
} from "../../../utils/currency";
import { Card } from "../../common";

const BudgetAlerts = () => {
  const {
    categories,
    expenses,
    currentMonth,
    getBudgetForCategory,
    getTotalBudgetForMonth,
  } = useExpense();

  // Get current month expenses
  const currentMonthExpenses = useMemo(() => {
    return getCurrentMonthExpenses(expenses, currentMonth);
  }, [expenses, currentMonth]);

  // Calculate budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts = [];
    const totalBudget = getTotalBudgetForMonth(currentMonth);
    const totalSpent = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalRemaining = totalBudget - totalSpent;
    const totalPercentage =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Overall budget alerts
    if (totalRemaining < 0) {
      alerts.push({
        type: "danger",
        title: "Overall Budget Exceeded",
        message: `You've exceeded your total budget by ${formatCurrency(
          Math.abs(totalRemaining)
        )}`,
        icon: "🚨",
        priority: 1,
      });
    } else if (totalPercentage >= 90) {
      alerts.push({
        type: "warning",
        title: "Near Total Budget Limit",
        message: `You've used ${totalPercentage.toFixed(
          1
        )}% of your total budget`,
        icon: "⚠️",
        priority: 2,
      });
    }

    // Category-specific alerts
    categories.forEach((category) => {
      const budget = getBudgetForCategory(category.id, currentMonth);
      const spent = calculateTotalByCategory(currentMonthExpenses, category.id);
      const budgetAmount = budget?.amount || 0;
      const remaining = budgetAmount - spent;
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

      if (remaining < 0) {
        alerts.push({
          type: "danger",
          title: `${category.name} Budget Exceeded`,
          message: `You've exceeded your ${
            category.name
          } budget by ${formatCurrency(Math.abs(remaining))}`,
          icon: category.icon,
          category: category.name,
          priority: 1,
        });
      } else if (percentage >= 80 && percentage < 100) {
        alerts.push({
          type: "warning",
          title: `${category.name} Near Limit`,
          message: `You've used ${percentage.toFixed(1)}% of your ${
            category.name
          } budget`,
          icon: category.icon,
          category: category.name,
          priority: 2,
        });
      }
    });

    // Sort by priority (danger first, then warning)
    return alerts.sort((a, b) => a.priority - b.priority);
  }, [
    categories,
    currentMonthExpenses,
    currentMonth,
    getBudgetForCategory,
    getTotalBudgetForMonth,
  ]);

  // Get alert statistics
  const alertStats = useMemo(() => {
    const dangerAlerts = budgetAlerts.filter(
      (alert) => alert.type === "danger"
    );
    const warningAlerts = budgetAlerts.filter(
      (alert) => alert.type === "warning"
    );

    return {
      total: budgetAlerts.length,
      danger: dangerAlerts.length,
      warning: warningAlerts.length,
    };
  }, [budgetAlerts]);

  if (budgetAlerts.length === 0) {
    return (
      <div className="budget-alerts">
        <Card title="Budget Alerts">
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h4>All Good!</h4>
            <p>Your budgets are within healthy limits.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="budget-alerts">
      <Card title="Budget Alerts">
        {/* Alert Summary */}
        <div className="alert-summary">
          <div className="alert-stat">
            <span className="stat-number">{alertStats.total}</span>
            <span className="stat-label">Total Alerts</span>
          </div>
          <div className="alert-stat">
            <span className="stat-number stat-number--danger">
              {alertStats.danger}
            </span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="alert-stat">
            <span className="stat-number stat-number--warning">
              {alertStats.warning}
            </span>
            <span className="stat-label">Warnings</span>
          </div>
        </div>

        {/* Alert List */}
        <div className="alert-list">
          {budgetAlerts.map((alert, index) => (
            <div
              key={`${alert.title}-${index}`}
              className={`alert-item alert-item--${alert.type}`}
            >
              <div className="alert-icon">{alert.icon}</div>
              <div className="alert-content">
                <h4 className="alert-title">{alert.title}</h4>
                <p className="alert-message">{alert.message}</p>
                {alert.category && (
                  <span className="alert-category">{alert.category}</span>
                )}
              </div>
              <div className="alert-indicator">
                <div
                  className={`indicator-dot indicator-dot--${alert.type}`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Suggestions */}
        <div className="alert-actions">
          <h4>Suggested Actions</h4>
          <ul className="action-list">
            {alertStats.danger > 0 && (
              <li className="action-item">
                <span className="action-icon">💰</span>
                <span>
                  Review and reduce spending in over-budget categories
                </span>
              </li>
            )}
            {alertStats.warning > 0 && (
              <li className="action-item">
                <span className="action-icon">📊</span>
                <span>Monitor spending closely in categories near limits</span>
              </li>
            )}
            <li className="action-item">
              <span className="action-icon">📅</span>
              <span>Consider adjusting budgets for next month</span>
            </li>
            <li className="action-item">
              <span className="action-icon">🎯</span>
              <span>
                Set up spending reminders for high-priority categories
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default BudgetAlerts;
