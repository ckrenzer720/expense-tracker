// Application Routes
export const ROUTES = {
  DASHBOARD: "dashboard",
  EXPENSES: "expenses",
  BUDGETS: "budgets",
  ANALYTICS: "analytics",
};

// Navigation Items
export const NAV_ITEMS = [
  { id: ROUTES.DASHBOARD, label: "Dashboard", icon: "📊" },
  { id: ROUTES.EXPENSES, label: "Expenses", icon: "💰" },
  { id: ROUTES.BUDGETS, label: "Budgets", icon: "📋" },
  { id: ROUTES.ANALYTICS, label: "Analytics", icon: "📈" },
];

// Page Titles
export const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.EXPENSES]: "Expenses",
  [ROUTES.BUDGETS]: "Budgets",
  [ROUTES.ANALYTICS]: "Analytics",
};

// Page Descriptions
export const PAGE_DESCRIPTIONS = {
  [ROUTES.DASHBOARD]: "Welcome back! Here's your financial overview.",
  [ROUTES.EXPENSES]: "Manage and track your expenses",
  [ROUTES.BUDGETS]: "Set and track your monthly spending limits",
  [ROUTES.ANALYTICS]: "Insights into your spending patterns",
};
