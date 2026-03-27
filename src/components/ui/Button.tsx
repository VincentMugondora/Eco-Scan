import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  size = "md", 
  children, 
  className, 
  ...props 
}) => {
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20",
    secondary: "bg-accent text-white hover:bg-accent-soft",
    outline: "bg-transparent border border-border-soft text-text-muted hover:bg-neutral-bg",
    ghost: "bg-transparent text-text-muted hover:bg-neutral-bg hover:text-text-main",
    danger: "bg-urgent text-white hover:bg-red-600",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-2.5",
  };

  return (
    <button 
      className={cn(
        "rounded-2xl font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
