import React from "react";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  className = "",
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
    xlarge: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-blue-500",
    secondary: "border-gray-500",
    success: "border-green-500",
    danger: "border-red-500",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
