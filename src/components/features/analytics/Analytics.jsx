import React from "react";
import { useExpense } from "../../../hooks/useExpense";
import {
  formatCurrency,
  getCurrentMonthExpenses,
} from "../../../utils/currency";
import { Card } from "../../common";

const Analytics = () => {
  const { expenses, categories } = useExpense();
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpent = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const getCategoryData = () => {
    return categories
      .map((category) => {
        const categoryExpenses = currentMonthExpenses.filter(
          (expense) => expense.category === category.id
        );
        const total = categoryExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0;

        return {
          ...category,
          total,
          percentage,
          count: categoryExpenses.length,
        };
      })
      .filter((category) => category.total > 0);
  };

  const getTopCategories = () => {
    return getCategoryData()
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const getMonthlyTrend = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    // For demo purposes, generate some sample data
    return months.map((month, index) => ({
      month,
      amount: index <= currentMonth ? Math.random() * 2000 + 500 : 0,
    }));
  };

  const categoryData = getCategoryData();
  const topCategories = getTopCategories();
  const monthlyTrend = getMonthlyTrend();

  return (
    <div className="container">
      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>Insights into your spending patterns</p>
      </div>

      <div className="analytics-overview">
        <Card title="This Month's Overview" className="overview-card">
          <div className="overview-stats">
            <div className="overview-stat">
              <div className="stat-value">{formatCurrency(totalSpent)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{currentMonthExpenses.length}</div>
              <div className="stat-label">Transactions</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{categoryData.length}</div>
              <div className="stat-label">Categories Used</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">
                {formatCurrency(totalSpent / currentMonthExpenses.length || 0)}
              </div>
              <div className="stat-label">Average per Transaction</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="analytics-content">
        <div className="analytics-grid">
          <Card title="Spending by Category" className="category-breakdown">
            {categoryData.length === 0 ? (
              <p className="no-data">
                No spending data available for this month.
              </p>
            ) : (
              <div className="category-chart">
                {categoryData.map((category) => (
                  <div key={category.id} className="category-bar">
                    <div className="category-info">
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-amount">
                        {formatCurrency(category.total)}
                      </span>
                    </div>
                    <div className="category-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="category-percentage">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Top Spending Categories" className="top-categories">
            {topCategories.length === 0 ? (
              <p className="no-data">No spending data available.</p>
            ) : (
              <div className="top-list">
                {topCategories.map((category, index) => (
                  <div key={category.id} className="top-item">
                    <div className="rank">#{index + 1}</div>
                    <div className="category-info">
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                    </div>
                    <div className="category-stats">
                      <div className="category-amount">
                        {formatCurrency(category.total)}
                      </div>
                      <div className="category-count">
                        {category.count} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Monthly Spending Trend" className="monthly-trend">
            <div className="trend-chart">
              {monthlyTrend.map((data, index) => (
                <div key={index} className="trend-bar">
                  <div className="trend-label">{data.month}</div>
                  <div className="trend-bar-container">
                    <div
                      className="trend-bar-fill"
                      style={{
                        height: `${
                          data.amount > 0 ? (data.amount / 2500) * 100 : 0
                        }%`,
                        backgroundColor:
                          index === new Date().getMonth()
                            ? "var(--primary)"
                            : "var(--secondary)",
                      }}
                    ></div>
                  </div>
                  <div className="trend-amount">
                    {formatCurrency(data.amount)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Spending Insights" className="insights">
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon">💰</div>
                <div className="insight-content">
                  <h4>Biggest Expense Category</h4>
                  <p>
                    {topCategories[0]
                      ? `${
                          topCategories[0].name
                        } (${topCategories[0].percentage.toFixed(1)}%)`
                      : "No data available"}
                  </p>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon">📊</div>
                <div className="insight-content">
                  <h4>Average Daily Spending</h4>
                  <p>{formatCurrency(totalSpent / 30)}</p>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Most Active Category</h4>
                  <p>
                    {topCategories[0]
                      ? `${topCategories[0].name} (${topCategories[0].count} transactions)`
                      : "No data available"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
