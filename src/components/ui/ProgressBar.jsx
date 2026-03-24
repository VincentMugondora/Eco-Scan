import React from "react";
import { cn } from "../../utils/cn";

const ProgressBar = ({ value, max = 100, variant = "primary", className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "bg-primary",
    danger: "bg-danger",
    warning: "bg-warning",
  };

  return (
    <div className={cn("h-1.5 w-full bg-gray-100 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500", variants[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { ProgressBar };
