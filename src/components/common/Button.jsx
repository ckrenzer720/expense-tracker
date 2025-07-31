import React, { memo } from "react";

const Button = memo(
  ({
    children,
    variant = "primary",
    size = "medium",
    onClick,
    disabled = false,
    className = "",
    ...props
  }) => {
    const baseClasses = "button";
    const variantClasses = {
      primary: "button--primary",
      secondary: "button--secondary",
      danger: "button--danger",
      warning: "button--warning",
    };
    const sizeClasses = {
      small: "button--small",
      medium: "button--medium",
      large: "button--large",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        className={classes}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
