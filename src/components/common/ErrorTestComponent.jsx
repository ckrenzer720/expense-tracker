import React, { useState, useEffect } from "react";
import { Button } from "./index";

/**
 * Hidden developer tool to test Error Boundary functionality
 * Only appears when Ctrl+Shift+E is pressed in development mode
 */
const ErrorTestComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldThrow, setShouldThrow] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only show in development mode
      if (!import.meta.env.DEV) return;

      // Check for Ctrl+Shift+E
      if (event.ctrlKey && event.shiftKey && event.key === "E") {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }

      // Check for Escape to hide
      if (event.key === "Escape") {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (shouldThrow) {
    throw new Error(
      "This is a test error to demonstrate Error Boundary functionality!"
    );
  }

  const handleThrowError = () => {
    setShouldThrow(true);
  };

  const handleThrowAsyncError = () => {
    // Simulate an async error
    setTimeout(() => {
      throw new Error("This is an async error!");
    }, 100);
  };

  const handleThrowDataError = () => {
    // Simulate a data processing error
    const invalidData = null;
    invalidData.someProperty; // This will throw a TypeError
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="error-test-overlay">
      <div className="error-test-modal">
        <div className="error-test-header">
          <h3>🧪 Error Boundary Test</h3>
          <button
            className="error-test-close"
            onClick={() => setIsVisible(false)}
          >
            ×
          </button>
        </div>

        <div className="error-test-content">
          <p>
            Test different error scenarios to verify Error Boundary
            functionality:
          </p>

          <div className="error-test-buttons">
            <Button variant="danger" onClick={handleThrowError} size="small">
              Throw Sync Error
            </Button>

            <Button
              variant="warning"
              onClick={handleThrowAsyncError}
              size="small"
            >
              Throw Async Error
            </Button>

            <Button
              variant="secondary"
              onClick={handleThrowDataError}
              size="small"
            >
              Throw Data Error
            </Button>
          </div>

          <div className="error-test-info">
            <small>
              <strong>Keyboard Shortcuts:</strong>
              <br />
              • Ctrl+Shift+E: Toggle this panel
              <br />• Escape: Hide this panel
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorTestComponent;
