import React, { useState } from "react";
import { Budgets, BudgetHistory, BudgetAlerts } from "./index";
import { Card } from "../../common";

const BudgetPage = () => {
  const [activeTab, setActiveTab] = useState("budgets");

  const tabs = [
    {
      id: "budgets",
      label: "Budget Management",
      icon: "💰",
      component: <Budgets />,
    },
    {
      id: "alerts",
      label: "Budget Alerts",
      icon: "🚨",
      component: <BudgetAlerts />,
    },
    {
      id: "history",
      label: "Budget History",
      icon: "📊",
      component: <BudgetHistory />,
    },
  ];

  return (
    <div className="budget-page">
      {/* Tab Navigation */}
      <div className="budget-tabs">
        <Card>
          <div className="tab-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default BudgetPage;
