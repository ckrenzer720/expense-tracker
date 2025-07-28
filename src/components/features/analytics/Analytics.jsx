import React from "react";
import { useExpense } from "../../../hooks";
import { formatCurrency, getCurrentMonthExpenses } from "../../../utils";
import { Card, LoadingSkeleton, Button } from "../../common";

const Analytics = () => {
  const { expenses, categories, loading, error } = useExpense();
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpent = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const getCategoryAnalyticsData = () => {
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

  const getTopSpendingCategories = () => {
    return getCategoryAnalyticsData()
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const getMonthlySpendingTrend = () => {
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

  // Show loading state while data is being loaded
  if (loading) {
    return (
      <div className="container">
        <div className="analytics-header">
          <h2>Analytics</h2>
          <p>Insights into your spending patterns</p>
        </div>

        <div className="analytics-overview">
          <Card title="This Month's Overview" className="overview-card">
            <LoadingSkeleton type="card" />
          </Card>
        </div>

        <div className="analytics-content">
          <div className="analytics-grid">
            <Card title="Spending by Category" className="category-breakdown">
              <LoadingSkeleton type="expense-item" count={4} />
            </Card>

            <Card title="Top Spending Categories" className="top-categories">
              <LoadingSkeleton type="expense-item" count={3} />
            </Card>

            <Card title="Monthly Spending Trend" className="monthly-trend">
              <LoadingSkeleton type="card" />
            </Card>

            <Card title="Spending Insights" className="insights">
              <LoadingSkeleton type="card" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="container">
        <div className="analytics-header">
          <h2>Analytics</h2>
          <p>Insights into your spending patterns</p>
        </div>

        <div className="analytics-content">
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
                Failed to Load Analytics
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

  const categoryAnalyticsData = getCategoryAnalyticsData();
  const topSpendingCategories = getTopSpendingCategories();
  const monthlySpendingTrend = getMonthlySpendingTrend();

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
              <div className="stat-value">{categoryAnalyticsData.length}</div>
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
            {categoryAnalyticsData.length === 0 ? (
              <p className="no-data">
                No spending data available for this month.
              </p>
            ) : (
              <div className="category-chart">
                {categoryAnalyticsData.map((category) => (
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
            {topSpendingCategories.length === 0 ? (
              <p className="no-data">No spending data available.</p>
            ) : (
              <div className="top-list">
                {topSpendingCategories.map((category, index) => (
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
              {monthlySpendingTrend.map((data, index) => (
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
                    {topSpendingCategories[0]
                      ? `${topSpendingCategories[0].name} with ${formatCurrency(
                          topSpendingCategories[0].total
                        )}`
                      : "No data available"}
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">📊</div>
                <div className="insight-content">
                  <h4>Average Transaction</h4>
                  <p>
                    {formatCurrency(
                      totalSpent / currentMonthExpenses.length || 0
                    )}
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Most Active Category</h4>
                  <p>
                    {topSpendingCategories[0]
                      ? `${topSpendingCategories[0].name} with ${topSpendingCategories[0].count} transactions`
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
