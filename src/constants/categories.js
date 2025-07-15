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

// Default Budgets
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

// Local Storage Keys
export const STORAGE_KEYS = {
  EXPENSES: "expenses",
  BUDGETS: "budgets",
  SETTINGS: "settings",
};

// App Settings
export const APP_SETTINGS = {
  CURRENCY: "USD",
  DATE_FORMAT: "YYYY-MM-DD",
  DEFAULT_MONTHLY_BUDGET: 2000,
};
