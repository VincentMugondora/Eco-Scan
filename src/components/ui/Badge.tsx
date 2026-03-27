import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "solid" | "soft";
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = "soft" }) => {
  const variantClasses = {
    soft: "bg-primary-light text-primary border-none",
    outline: "bg-transparent border border-border-soft text-text-muted",
    solid: "bg-primary text-white border-none",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase",
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
};
