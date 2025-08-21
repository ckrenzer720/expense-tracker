import React, { useMemo, useCallback } from "react";
import { useExpense } from "../../../hooks";
import {
  formatCurrency,
  calculateTotalByCategory,
  getCurrentMonthExpenses,
} from "../../../utils";
import { getCurrentMonth, formatMonth } from "../../../utils";
import { Card } from "../../common";

const BudgetHistory = () => {
  const { categories, expenses, getBudgetForCategory, getTotalBudgetForMonth } =
    useExpense();

  // Generate last 6 months for history
  const generateHistoryMonths = () => {
    const months = [];
    let current = new Date(getCurrentMonth() + "-01");

    for (let i = 5; i >= 0; i--) {
      const date = new Date(current);
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    return months;
  };

  const historyMonths = useMemo(() => generateHistoryMonths(), []);

  // Calculate monthly budget data
  const monthlyData = useMemo(() => {
    return historyMonths.map((month) => {
      const monthExpenses = getCurrentMonthExpenses(expenses, month);
      const totalBudget = getTotalBudgetForMonth(month);
      const totalSpent = monthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const totalRemaining = totalBudget - totalSpent;
      const percentageUsed =
        totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      // Calculate category breakdown
      const categoryBreakdown = categories.map((category) => {
        const budget = getBudgetForCategory(category.id, month);
        const spent = calculateTotalByCategory(monthExpenses, category.id);
        const budgetAmount = budget?.amount || 0;
        const remaining = budgetAmount - spent;
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          categoryId: category.id,
          categoryName: category.name,
          categoryIcon: category.icon,
          budget: budgetAmount,
          spent,
          remaining,
          percentage,
          isOverBudget: remaining < 0,
        };
      });

      return {
        month,
        totalBudget,
        totalSpent,
        totalRemaining,
        percentageUsed,
        categoryBreakdown,
        isOverBudget: totalRemaining < 0,
      };
    });
  }, [
    historyMonths,
    expenses,
    categories,
    getTotalBudgetForMonth,
    getBudgetForCategory,
  ]);

  // Get trend indicators
  const getTrendIndicator = (current, previous) => {
    if (!previous) return null;

    const diff = current - previous;
    const percentage = previous > 0 ? (diff / previous) * 100 : 0;

    if (percentage > 10)
      return {
        direction: "up",
        color: "var(--danger)",
        text: `+${percentage.toFixed(1)}%`,
      };
    if (percentage < -10)
      return {
        direction: "down",
        color: "var(--secondary)",
        text: `${percentage.toFixed(1)}%`,
      };
    return {
      direction: "stable",
      color: "var(--text-secondary)",
      text: "Stable",
    };
  };

  // Get top spending categories for the current month
  const getTopSpendingCategories = useCallback(() => {
    return monthlyData
      .flatMap((data) => data.categoryBreakdown)
      .reduce((acc, category) => {
        const existing = acc.find((c) => c.categoryId === category.categoryId);
        if (existing) {
          existing.spent += category.spent;
        } else {
          acc.push({ ...category });
        }
        return acc;
      }, [])
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);
  }, [monthlyData]);

  const topSpendingCategories = useMemo(
    () => getTopSpendingCategories(),
    [getTopSpendingCategories]
  );

  return (
    <div className="container">
      <div className="budget-history">
        <Card title="Budget History (Last 6 Months)">
          <div className="history-overview">
            <div className="history-stats">
              <div className="history-stat">
                <div className="stat-label">Average Monthly Budget</div>
                <div className="stat-value">
                  {formatCurrency(
                    monthlyData.reduce(
                      (sum, data) => sum + data.totalBudget,
                      0
                    ) / monthlyData.length
                  )}
                </div>
              </div>
              <div className="history-stat">
                <div className="stat-label">Average Monthly Spending</div>
                <div className="stat-value">
                  {formatCurrency(
                    monthlyData.reduce(
                      (sum, data) => sum + data.totalSpent,
                      0
                    ) / monthlyData.length
                  )}
                </div>
              </div>
              <div className="history-stat">
                <div className="stat-label">Months Over Budget</div>
                <div className="stat-value">
                  {monthlyData.filter((data) => data.isOverBudget).length}
                </div>
              </div>
            </div>
          </div>

          <div className="history-timeline">
            <h4>Monthly Breakdown</h4>
            <div className="timeline-grid">
              {monthlyData.map((data, index) => {
                const previousData = index > 0 ? monthlyData[index - 1] : null;
                const budgetTrend = getTrendIndicator(
                  data.totalBudget,
                  previousData?.totalBudget
                );
                const spendingTrend = getTrendIndicator(
                  data.totalSpent,
                  previousData?.totalSpent
                );

                return (
                  <div key={data.month} className="timeline-item">
                    <div className="timeline-header">
                      <h5>{formatMonth(data.month)}</h5>
                      <div className="timeline-status">
                        {data.isOverBudget && (
                          <span className="status-badge status-badge--danger">
                            Over Budget
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="timeline-stats">
                      <div className="timeline-stat">
                        <span className="stat-label">Budget:</span>
                        <span className="stat-value">
                          {formatCurrency(data.totalBudget)}
                        </span>
                        {budgetTrend && (
                          <span
                            className="trend-indicator"
                            style={{ color: budgetTrend.color }}
                          >
                            {budgetTrend.text}
                          </span>
                        )}
                      </div>
                      <div className="timeline-stat">
                        <span className="stat-label">Spent:</span>
                        <span className="stat-value">
                          {formatCurrency(data.totalSpent)}
                        </span>
                        {spendingTrend && (
                          <span
                            className="trend-indicator"
                            style={{ color: spendingTrend.color }}
                          >
                            {spendingTrend.text}
                          </span>
                        )}
                      </div>
                      <div className="timeline-stat">
                        <span className="stat-label">Remaining:</span>
                        <span
                          className={`stat-value ${
                            data.isOverBudget ? "over-budget" : ""
                          }`}
                        >
                          {formatCurrency(data.totalRemaining)}
                        </span>
                      </div>
                    </div>

                    <div className="timeline-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(data.percentageUsed, 100)}%`,
                            backgroundColor: data.isOverBudget
                              ? "var(--danger)"
                              : data.percentageUsed >= 80
                                ? "var(--warning)"
                                : "var(--secondary)",
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {data.percentageUsed.toFixed(1)}%
                      </span>
                    </div>

                    {/* Top categories for this month */}
                    <div className="timeline-categories">
                      <div className="categories-label">Top Categories:</div>
                      <div className="categories-list">
                        {data.categoryBreakdown
                          .filter((cat) => cat.spent > 0)
                          .sort((a, b) => b.spent - a.spent)
                          .slice(0, 2)
                          .map((cat) => (
                            <div key={cat.categoryId} className="category-item">
                              <span className="category-icon">
                                {cat.categoryIcon}
                              </span>
                              <span className="category-amount">
                                {formatCurrency(cat.spent)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Spending Categories Summary */}
          <div className="top-categories">
            <h4>Current Month Top Categories</h4>
            <div className="categories-summary">
              {topSpendingCategories.map((cat) => (
                <div key={cat.categoryId} className="category-summary">
                  <div className="category-info">
                    <span className="category-icon">{cat.categoryIcon}</span>
                    <span className="category-name">{cat.categoryName}</span>
                  </div>
                  <div className="category-amounts">
                    <span className="amount-spent">
                      {formatCurrency(cat.spent)}
                    </span>
                    <span className="amount-budget">
                      / {formatCurrency(cat.budget)}
                    </span>
                  </div>
                  <div className="category-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(cat.percentage, 100)}%`,
                          backgroundColor: cat.isOverBudget
                            ? "var(--danger)"
                            : cat.percentage >= 80
                              ? "var(--warning)"
                              : "var(--secondary)",
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BudgetHistory;
