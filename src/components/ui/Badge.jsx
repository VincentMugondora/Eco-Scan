import React from "react";
import { cn } from "../../utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-text-secondary",
    success: "bg-primary-light text-primary",
    warning: "bg-orange-50 text-warning",
    danger: "bg-red-50 text-danger",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
