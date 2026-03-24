import React from "react";
import { cn } from "../../utils/cn";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-5 shadow-sm border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
