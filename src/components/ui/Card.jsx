import React from "react";

const Card = ({
  children,
  title,
  className = "",
  padding = "medium",
  ...props
}) => {
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
};

export default Card;
