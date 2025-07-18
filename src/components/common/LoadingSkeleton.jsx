import React from "react";

const LoadingSkeleton = ({
  type = "expense-item",
  count = 1,
  className = "",
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "expense-item":
        return (
          <div className="expense-item animate-pulse">
            <div className="expense-icon">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="expense-details flex-1">
              <div className="expense-category">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              </div>
              <div className="expense-notes">
                <div className="h-3 bg-gray-300 rounded w-32 mb-1"></div>
              </div>
              <div className="expense-date">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
            <div className="expense-amount">
              <div className="h-5 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="expense-actions">
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        );

      case "card":
        return (
          <div className={`card animate-pulse ${className}`}>
            <div className="card-header">
              <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );

      case "button":
        return (
          <div
            className={`h-10 bg-gray-300 rounded animate-pulse ${className}`}
          ></div>
        );

      case "form":
        return (
          <div className="space-y-4 animate-pulse">
            <div>
              <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`h-4 bg-gray-300 rounded animate-pulse ${className}`}
          ></div>
        );
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
