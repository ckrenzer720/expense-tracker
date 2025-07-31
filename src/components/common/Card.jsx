import React, { memo } from "react";

const Card = memo(
  ({ children, title, className = "", padding = "medium", ...props }) => {
    const baseClasses = "card";
    const paddingClasses = {
      small: "card--padding-small",
      medium: "card--padding-medium",
      large: "card--padding-large",
    };

    const classes = [baseClasses, paddingClasses[padding], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes} {...props}>
        {title && <h3 className="card-title">{title}</h3>}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
