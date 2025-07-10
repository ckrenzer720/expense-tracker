// Currency formatting utility
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Calculate total expenses
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate total by category
export const calculateTotalByCategory = (expenses, categoryId) => {
  return expenses
    .filter((expense) => expense.category === categoryId)
    .reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for current month
export const getCurrentMonthExpenses = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
};
