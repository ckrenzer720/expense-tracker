// Validation utilities
export const validateExpense = (expense) => {
  const errors = {};

  if (!expense.amount || expense.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!expense.category) {
    errors.category = "Please select a category";
  }

  if (!expense.date) {
    errors.date = "Please select a date";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAmount = (amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return "Please enter a valid amount greater than 0";
  }
  return null;
};

export const validateDate = (date) => {
  if (!date) {
    return "Please select a date";
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // Allow dates up to 1 year in the future for planned expenses
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(today.getFullYear() + 1);

  if (selectedDate < new Date("2020-01-01")) {
    return "Date cannot be before 2020";
  }

  if (selectedDate > maxFutureDate) {
    return "Date cannot be more than 1 year in the future";
  }

  return null;
};
