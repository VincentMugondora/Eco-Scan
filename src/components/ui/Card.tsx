import React from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-surface border border-border-soft rounded-3xl shadow-sm transition-all duration-300",
        onClick && "cursor-pointer active:scale-[0.98] hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};
