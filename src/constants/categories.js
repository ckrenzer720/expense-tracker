// Expense Categories Constants
export const EXPENSE_CATEGORIES = [
  { id: "1", name: "Food & Dining", color: "#10B981", icon: "🍽️" },
  { id: "2", name: "Transportation", color: "#3B82F6", icon: "🚗" },
  { id: "3", name: "Shopping", color: "#8B5CF6", icon: "🛍️" },
  { id: "4", name: "Entertainment", color: "#F59E0B", icon: "🎬" },
  { id: "5", name: "Utilities", color: "#EF4444", icon: "⚡" },
  { id: "6", name: "Healthcare", color: "#06B6D4", icon: "🏥" },
  { id: "7", name: "Education", color: "#84CC16", icon: "📚" },
  { id: "8", name: "Other", color: "#6B7280", icon: "📝" },
];

// Default Budgets (legacy format for migration)
export const DEFAULT_BUDGETS = {
  1: 500, // Food & Dining
  2: 300, // Transportation
  3: 400, // Shopping
  4: 200, // Entertainment
  5: 150, // Utilities
  6: 100, // Healthcare
  7: 200, // Education
  8: 150, // Other
};

// New Budget Structure - Monthly Budgets
export const createDefaultMonthlyBudgets = (month = null) => {
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM format

  return EXPENSE_CATEGORIES.map((category) => ({
    id: `${category.id}-${currentMonth}`,
    categoryId: category.id,
    amount: DEFAULT_BUDGETS[category.id] || 0,
    month: currentMonth,
    rollover: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Local Storage Keys
export const STORAGE_KEYS = {
  EXPENSES: "expenses",
  BUDGETS: "budgets",
  BUDGETS_V2: "budgets_v2", // New budget storage key
  SETTINGS: "settings",
};

// App Settings
export const APP_SETTINGS = {
  CURRENCY: "USD",
  DATE_FORMAT: "YYYY-MM-DD",
  DEFAULT_MONTHLY_BUDGET: 2000,
  BUDGET_ROLLOVER_ENABLED: true,
  BUDGET_ALERT_THRESHOLD: 0.8, // 80% of budget
};
