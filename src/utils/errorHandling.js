/**
 * Error handling utilities for the expense tracker application
 */

/**
 * Logs an error with context information
 * @param {Error} error - The error object
 * @param {Object} context - Additional context about where the error occurred
 * @param {string} context.component - Component name where error occurred
 * @param {string} context.action - Action being performed when error occurred
 * @param {Object} context.data - Any relevant data
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context,
  };

  // Log to console for development
  console.error("Application Error:", errorInfo);

  // In production, you could send this to an error reporting service
  // Example: sendToErrorService(errorInfo);

  // Store in localStorage for debugging (limit to last 10 errors)
  try {
    const existingErrors = JSON.parse(
      localStorage.getItem("app_errors") || "[]"
    );
    existingErrors.unshift(errorInfo);

    // Keep only the last 10 errors
    const limitedErrors = existingErrors.slice(0, 10);
    localStorage.setItem("app_errors", JSON.stringify(limitedErrors));
  } catch (storageError) {
    console.error("Failed to store error in localStorage:", storageError);
  }
};

/**
 * Creates a user-friendly error message
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - Fallback message if error type is unknown
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (
  error,
  fallbackMessage = "Something went wrong"
) => {
  if (!error) return fallbackMessage;

  // Handle specific error types
  if (error.name === "TypeError") {
    return "There was an issue with the data format. Please try again.";
  }

  if (error.name === "RangeError") {
    return "The value provided is outside the acceptable range.";
  }

  if (error.message.includes("localStorage")) {
    return "Unable to save data. Please check your browser settings.";
  }

  if (error.message.includes("JSON")) {
    return "There was an issue processing the data. Please refresh the page.";
  }

  if (error.message.includes("network") || error.message.includes("fetch")) {
    return "Network connection issue. Please check your internet connection.";
  }

  // Return the error message if it's user-friendly, otherwise use fallback
  return error.message || fallbackMessage;
};

/**
 * Handles async operations with error catching
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} context - Context for error logging
 * @returns {Promise} Promise that resolves with the result or rejects with handled error
 */
export const withErrorHandling = async (asyncFunction, context = {}) => {
  try {
    return await asyncFunction();
  } catch (error) {
    logError(error, context);
    throw error;
  }
};

/**
 * Validates and sanitizes data before processing
 * @param {any} data - Data to validate
 * @param {string} dataType - Expected data type
 * @returns {Object} Validation result with isValid and sanitized data
 */
export const validateData = (data, dataType) => {
  try {
    switch (dataType) {
      case "expense": {
        if (!data || typeof data !== "object") {
          throw new Error("Invalid expense data");
        }

        const sanitized = {
          id: data.id || Date.now().toString(),
          amount: parseFloat(data.amount) || 0,
          category: data.category || "",
          date: data.date || new Date().toISOString().split("T")[0],
          notes: data.notes || "",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return { isValid: true, data: sanitized };
      }

      case "budget": {
        if (!data || typeof data !== "object") {
          throw new Error("Invalid budget data");
        }

        const sanitizedBudget = {};
        Object.keys(data).forEach((key) => {
          const value = parseFloat(data[key]);
          sanitizedBudget[key] = isNaN(value) ? 0 : Math.max(0, value);
        });

        return { isValid: true, data: sanitizedBudget };
      }

      default:
        return { isValid: true, data };
    }
  } catch (error) {
    logError(error, { component: "validateData", dataType });
    return { isValid: false, error: error.message };
  }
};

/**
 * Recovers from common error scenarios
 * @param {Error} error - The error that occurred
 * @param {string} context - Context where error occurred
 * @returns {boolean} Whether recovery was successful
 */
export const attemptRecovery = (error, context) => {
  try {
    switch (context) {
      case "localStorage":
        // Try to clear corrupted localStorage data
        if (error.message.includes("localStorage")) {
          localStorage.clear();
          return true;
        }
        break;

      case "data":
        // Try to reset to default state
        if (error.message.includes("JSON")) {
          localStorage.removeItem("expenses");
          localStorage.removeItem("budgets");
          return true;
        }
        break;

      default:
        return false;
    }
  } catch (recoveryError) {
    logError(recoveryError, {
      component: "attemptRecovery",
      originalError: error,
    });
    return false;
  }

  return false;
};
