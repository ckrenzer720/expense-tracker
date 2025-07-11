import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { formatCurrency, calculateTotalByCategory } from "../../utils/currency";
import Card from "../ui/Card";
import Button from "../ui/Button";

const Budgets = () => {
  const { categories, expenses } = useExpense();
  const [budgets, setBudgets] = useState({
    1: 500, // Food & Dining
    2: 300, // Transportation
    3: 400, // Shopping
    4: 200, // Entertainment
    5: 150, // Utilities
    6: 100, // Healthcare
    7: 200, // Education
    8: 150, // Other
  });

  const getSpentAmount = (categoryId) => {
    return calculateTotalByCategory(expenses, categoryId);
  };

  const getRemainingAmount = (categoryId) => {
    const budget = budgets[categoryId] || 0;
    const spent = getSpentAmount(categoryId);
    return budget - spent;
  };

  const getProgressPercentage = (categoryId) => {
    const budget = budgets[categoryId] || 0;
    const spent = getSpentAmount(categoryId);
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "var(--danger)";
    if (percentage >= 75) return "var(--warning)";
    return "var(--secondary)";
  };

  const handleBudgetChange = (categoryId, newAmount) => {
    setBudgets((prev) => ({
      ...prev,
      [categoryId]: parseFloat(newAmount) || 0,
    }));
  };

  const totalBudget = Object.values(budgets).reduce(
    (sum, budget) => sum + budget,
    0
  );
  const totalSpent = categories.reduce(
    (sum, category) => sum + getSpentAmount(category.id),
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="container">
      <div className="budgets-header">
        <div>
          <h2>Budgets</h2>
          <p>Set and track your monthly spending limits</p>
        </div>
      </div>

      <div className="budgets-overview">
        <Card title="Monthly Overview" className="overview-card">
          <div className="overview-stats">
            <div className="overview-stat">
              <div className="stat-value">{formatCurrency(totalBudget)}</div>
              <div className="stat-label">Total Budget</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{formatCurrency(totalSpent)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">{formatCurrency(totalRemaining)}</div>
              <div className="stat-label">Remaining</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="budgets-content">
        <Card title="Category Budgets">
          <div className="budget-list">
            {categories.map((category) => {
              const spent = getSpentAmount(category.id);
              const remaining = getRemainingAmount(category.id);
              const percentage = getProgressPercentage(category.id);
              const progressColor = getProgressColor(percentage);

              return (
                <div key={category.id} className="budget-item">
                  <div className="budget-header">
                    <div className="budget-category">
                      <span className="budget-icon">{category.icon}</span>
                      <span className="budget-name">{category.name}</span>
                    </div>
                    <div className="budget-amounts">
                      <span className="budget-spent">
                        {formatCurrency(spent)}
                      </span>
                      <span className="budget-separator">/</span>
                      <input
                        type="number"
                        className="budget-input"
                        value={budgets[category.id] || 0}
                        onChange={(e) =>
                          handleBudgetChange(category.id, e.target.value)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: progressColor,
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {percentage.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="budget-remaining">
                    <span
                      className={`remaining-amount ${
                        remaining < 0 ? "over-budget" : ""
                      }`}
                    >
                      {remaining >= 0
                        ? `${formatCurrency(remaining)} remaining`
                        : `${formatCurrency(Math.abs(remaining))} over budget`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Budgets;
