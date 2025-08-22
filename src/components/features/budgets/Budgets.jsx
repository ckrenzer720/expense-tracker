import React, { useState, useMemo } from "react";
import { useExpense } from "../../../hooks";
import {
  formatCurrency,
  calculateTotalByCategory,
  getCurrentMonthExpenses,
} from "../../../utils";
import { getPreviousMonth, getNextMonth, formatMonth } from "../../../utils";
import { Card, Button, LoadingSkeleton } from "../../common";

const Budgets = () => {
  const {
    categories,
    expenses,
    currentMonth,
    setBudget,
    setBudgetRollover,
    setCurrentMonth,
    getBudgetForCategory,
    getTotalBudgetForMonth,
    loading,
  } = useExpense();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [showTemplates, setShowTemplates] = useState(false);
  const [customBudgetAmount, setCustomBudgetAmount] = useState("");

  // Get current month expenses for budget tracking
  const currentMonthExpenses = useMemo(() => {
    return getCurrentMonthExpenses(expenses, selectedMonth);
  }, [expenses, selectedMonth]);

  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    const totalBudget = getTotalBudgetForMonth(selectedMonth);
    const totalSpent = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalRemaining = totalBudget - totalSpent;
    const percentageUsed =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      percentageUsed,
    };
  }, [currentMonthExpenses, selectedMonth, getTotalBudgetForMonth]);

  // Get category budget data
  const getCategoryBudgetData = (categoryId) => {
    const budget = getBudgetForCategory(categoryId, selectedMonth);
    const spent = calculateTotalByCategory(currentMonthExpenses, categoryId);
    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - spent;
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

    return {
      budget,
      spent,
      remaining,
      percentage,
      isOverBudget: remaining < 0,
      isNearLimit: percentage >= 80 && percentage < 100,
      isAtLimit: percentage >= 100,
    };
  };

  // Get progress bar color based on usage
  const getProgressBarColor = (percentage, isOverBudget) => {
    if (isOverBudget) return "var(--danger)";
    if (percentage >= 90) return "var(--danger)";
    if (percentage >= 75) return "var(--warning)";
    return "var(--secondary)";
  };

  // Budget templates with customizable base amounts
  const budgetTemplates = [
    {
      name: "Conservative",
      description: "Tight budget for saving money",
      baseAmount: 1500,
      percentages: {
        1: 20, // Food & Dining - 20% of base
        2: 13, // Transportation - 13% of base
        3: 17, // Shopping - 17% of base
        4: 10, // Entertainment - 10% of base
        5: 8, // Utilities - 8% of base
        6: 5, // Healthcare - 5% of base
        7: 10, // Education - 10% of base
        8: 7, // Other - 7% of base
      },
    },
    {
      name: "Balanced",
      description: "Moderate spending with room for fun",
      baseAmount: 2500,
      percentages: {
        1: 20, // Food & Dining - 20% of base
        2: 12, // Transportation - 12% of base
        3: 16, // Shopping - 16% of base
        4: 8, // Entertainment - 8% of base
        5: 6, // Utilities - 6% of base
        6: 4, // Healthcare - 4% of base
        7: 8, // Education - 8% of base
        8: 6, // Other - 6% of base
      },
    },
    {
      name: "Luxury",
      description: "Comfortable lifestyle with premium spending",
      baseAmount: 4000,
      percentages: {
        1: 20, // Food & Dining - 20% of base
        2: 12, // Transportation - 12% of base
        3: 15, // Shopping - 15% of base
        4: 10, // Entertainment - 10% of base
        5: 5, // Utilities - 5% of base
        6: 4, // Healthcare - 4% of base
        7: 7, // Education - 7% of base
        8: 7, // Other - 7% of base
      },
    },
  ];

  // Apply budget template with custom base amount
  const applyBudgetTemplate = (template, customBaseAmount = null) => {
    const baseAmount = customBaseAmount || template.baseAmount;

    Object.entries(template.percentages).forEach(([categoryId, percentage]) => {
      const amount = Math.round((baseAmount * percentage) / 100);
      setBudget(categoryId, amount, selectedMonth);
    });
    setShowTemplates(false);
  };

  // Quick set total budget with smart distribution
  const quickSetBudget = (totalAmount) => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Smart distribution based on typical spending patterns
    const distribution = {
      1: 25, // Food & Dining - 25%
      2: 15, // Transportation - 15%
      3: 20, // Shopping - 20%
      4: 10, // Entertainment - 10%
      5: 8, // Utilities - 8%
      6: 5, // Healthcare - 5%
      7: 8, // Education - 8%
      8: 9, // Other - 9%
    };

    Object.entries(distribution).forEach(([categoryId, percentage]) => {
      const budgetAmount = Math.round((amount * percentage) / 100);
      setBudget(categoryId, budgetAmount, selectedMonth);
    });
  };

  // Handle month change
  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    setCurrentMonth(newMonth);
  };

  // Handle budget amount change
  const handleBudgetAmountChange = (categoryId, newAmount) => {
    setBudget(categoryId, newAmount, selectedMonth);
  };

  // Handle rollover toggle
  const handleRolloverToggle = (categoryId, rollover) => {
    setBudgetRollover(categoryId, rollover, selectedMonth);
  };

  // Generate month options (current month + 6 months back and forward)
  const generateMonthOptions = () => {
    const options = [];
    const current = new Date(selectedMonth + "-01");

    // Add 6 months back
    for (let i = 6; i > 0; i--) {
      const date = new Date(current);
      date.setMonth(date.getMonth() - i);
      options.push(date.toISOString().slice(0, 7));
    }

    // Add current month
    options.push(selectedMonth);

    // Add 6 months forward
    for (let i = 1; i <= 6; i++) {
      const date = new Date(current);
      date.setMonth(date.getMonth() + i);
      options.push(date.toISOString().slice(0, 7));
    }

    return options;
  };

  if (loading) {
    return (
      <div className="budgets-content">
        <div className="budgets-header">
          <h2>Budgets</h2>
          <p>Loading budget data...</p>
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="budgets-content">
      <div className="budgets-header">
        <div>
          <h2>Budgets</h2>
          <p>Set and track your monthly spending limits</p>
        </div>
        <div className="budgets-actions">
          <Button
            variant="secondary"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            {showTemplates ? "Hide" : "Show"} Templates
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const amount = prompt("Enter your total monthly budget:");
              if (amount) quickSetBudget(amount);
            }}
          >
            Quick Set Budget
          </Button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        <Card title="Select Month">
          <div className="month-navigation">
            <Button
              variant="outline"
              onClick={() => handleMonthChange(getPreviousMonth(selectedMonth))}
            >
              ← Previous
            </Button>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="month-select"
            >
              {generateMonthOptions().map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => handleMonthChange(getNextMonth(selectedMonth))}
            >
              Next →
            </Button>
          </div>
        </Card>
      </div>

      {/* Budget Templates */}
      {showTemplates && (
        <div className="budget-templates">
          <Card title="Budget Templates">
            <div className="template-intro">
              <p>Choose a template to get started, or customize the amount:</p>
              <div className="custom-amount-input">
                <label htmlFor="customAmount">Custom Monthly Budget:</label>
                <div className="input-group">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="customAmount"
                    value={customBudgetAmount}
                    onChange={(e) => setCustomBudgetAmount(e.target.value)}
                    placeholder="Enter your monthly budget"
                    min="0"
                    step="100"
                    className="custom-amount-field"
                  />
                </div>
              </div>
            </div>

            <div className="template-grid">
              {budgetTemplates.map((template) => {
                const baseAmount = customBudgetAmount
                  ? parseFloat(customBudgetAmount)
                  : template.baseAmount;
                const totalAmount = Object.values(template.percentages).reduce(
                  (sum, percentage) => sum + (baseAmount * percentage) / 100,
                  0
                );

                return (
                  <div key={template.name} className="template-card">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <div className="template-total">
                      Total: {formatCurrency(totalAmount)}
                    </div>
                    <div className="template-breakdown">
                      <small>
                        {Object.entries(template.percentages).map(
                          ([categoryId, percentage]) => {
                            const category = categories.find(
                              (cat) => cat.id === categoryId
                            );
                            const amount = Math.round(
                              (baseAmount * percentage) / 100
                            );
                            return (
                              <div key={categoryId} className="breakdown-item">
                                {category?.icon} {category?.name}:{" "}
                                {formatCurrency(amount)}
                              </div>
                            );
                          }
                        )}
                      </small>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        applyBudgetTemplate(
                          template,
                          customBudgetAmount
                            ? parseFloat(customBudgetAmount)
                            : null
                        )
                      }
                    >
                      Apply Template
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Monthly Overview */}
      <div className="budgets-overview">
        <Card
          title={`${formatMonth(selectedMonth)} Overview`}
          className="overview-card"
        >
          <div className="overview-stats">
            <div className="overview-stat">
              <div className="stat-value">
                {formatCurrency(budgetStats.totalBudget)}
              </div>
              <div className="stat-label">Total Budget</div>
            </div>
            <div className="overview-stat">
              <div className="stat-value">
                {formatCurrency(budgetStats.totalSpent)}
              </div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="overview-stat">
              <div
                className={`stat-value ${
                  budgetStats.totalRemaining < 0 ? "over-budget" : ""
                }`}
              >
                {formatCurrency(budgetStats.totalRemaining)}
              </div>
              <div className="stat-label">
                {budgetStats.totalRemaining >= 0 ? "Remaining" : "Over Budget"}
              </div>
            </div>
            <div className="overview-stat">
              <div
                className={`stat-value ${
                  budgetStats.percentageUsed >= 100
                    ? "over-budget"
                    : budgetStats.percentageUsed >= 80
                      ? "warning"
                      : ""
                }`}
              >
                {budgetStats.percentageUsed.toFixed(1)}%
              </div>
              <div className="stat-label">Used</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="overall-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(budgetStats.percentageUsed, 100)}%`,
                  backgroundColor: getProgressBarColor(
                    budgetStats.percentageUsed,
                    budgetStats.totalRemaining < 0
                  ),
                }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Budgets */}
      <div className="budgets-content">
        {budgetStats.totalBudget === 0 && (
          <Card title="Getting Started" className="getting-started-card">
            <div className="getting-started-content">
              <div className="getting-started-icon">💰</div>
              <h3>Set Up Your Monthly Budget</h3>
              <p>
                You haven't set any budgets yet. Use the templates above or the
                "Quick Set Budget" button to get started with your monthly
                spending plan.
              </p>
              <div className="getting-started-actions">
                <Button
                  variant="primary"
                  onClick={() => setShowTemplates(true)}
                >
                  Choose Template
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const amount = prompt("Enter your total monthly budget:");
                    if (amount) quickSetBudget(amount);
                  }}
                >
                  Quick Set Budget
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card title="Category Budgets">
          {budgetStats.totalBudget === 0 && (
            <div className="budget-setup-message">
              <p>
                💰 Set your monthly budgets to start tracking your spending!
              </p>
              <p>
                You can set individual category budgets or use the templates
                above.
              </p>
            </div>
          )}
          <div className="budget-list">
            {categories.map((category) => {
              const budgetData = getCategoryBudgetData(category.id);
              const progressColor = getProgressBarColor(
                budgetData.percentage,
                budgetData.isOverBudget
              );

              return (
                <div key={category.id} className="budget-item">
                  <div className="budget-header">
                    <div className="budget-category">
                      <span className="budget-icon">{category.icon}</span>
                      <span className="budget-name">{category.name}</span>

                      {/* Budget Alerts */}
                      {budgetData.isAtLimit && (
                        <span className="budget-alert budget-alert--danger">
                          ⚠️ Over Budget
                        </span>
                      )}
                      {budgetData.isNearLimit && !budgetData.isOverBudget && (
                        <span className="budget-alert budget-alert--warning">
                          ⚠️ Near Limit
                        </span>
                      )}
                    </div>

                    <div className="budget-amounts">
                      <span className="budget-spent">
                        {formatCurrency(budgetData.spent)}
                      </span>
                      <span className="budget-separator">/</span>
                      <input
                        type="number"
                        className="budget-input"
                        value={budgetData.budget?.amount || 0}
                        onChange={(e) =>
                          handleBudgetAmountChange(category.id, e.target.value)
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
                          width: `${Math.min(budgetData.percentage, 100)}%`,
                          backgroundColor: progressColor,
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {budgetData.percentage.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="budget-footer">
                    <div className="budget-remaining">
                      <span
                        className={`remaining-amount ${
                          budgetData.isOverBudget ? "over-budget" : ""
                        }`}
                      >
                        {budgetData.remaining >= 0
                          ? `${formatCurrency(budgetData.remaining)} remaining`
                          : `${formatCurrency(
                              Math.abs(budgetData.remaining)
                            )} over budget`}
                      </span>
                    </div>

                    {/* Rollover Toggle */}
                    <div className="budget-rollover">
                      <label className="rollover-toggle">
                        <input
                          type="checkbox"
                          checked={budgetData.budget?.rollover || false}
                          onChange={(e) =>
                            handleRolloverToggle(category.id, e.target.checked)
                          }
                        />
                        <span className="rollover-label">Rollover</span>
                      </label>
                    </div>
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
