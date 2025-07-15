import React, { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { validateExpense } from "../../utils/validation";
import Button from "../ui/Button";

const AddExpense = ({ onClose, onSuccess }) => {
  const { categories, addExpense } = useExpense();

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); // Allow up to 1 year in future
  const maxDateString = maxDate.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: today,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateExpense(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      addExpense(expenseData);
      onSuccess();
    } catch (error) {
      console.error("Error adding expense:", error);
      setErrors({ submit: "Failed to add expense. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Expense</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.amount ? "form-input error" : "form-input"}
              disabled={isSubmitting}
            />
            {errors.amount && (
              <span className="error-message">{errors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? "form-input error" : "form-input"}
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error-message">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min="2020-01-01"
                max={maxDateString}
                className={errors.date ? "form-input error" : "form-input"}
                disabled={isSubmitting}
              />
              <span className="date-icon">📅</span>
            </div>
            <small className="form-help">
              You can select any date from 2020 onwards, up to 1 year in the
              future
            </small>
            {errors.date && (
              <span className="error-message">{errors.date}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Optional notes about this expense..."
              className="form-input"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
