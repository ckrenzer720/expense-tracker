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

  if (selectedDate > today) {
    return "Date cannot be in the future";
  }

  return null;
};
