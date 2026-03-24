import React from "react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-md",
    secondary: "bg-primary-light text-primary hover:bg-primary-light/80",
    outline: "border-2 border-primary text-primary hover:bg-primary-light/50",
    ghost: "text-text-secondary hover:text-primary hover:bg-primary-light/30",
    danger: "bg-danger text-white hover:bg-danger/90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-6 py-3 text-sm font-semibold rounded-2xl",
    lg: "px-8 py-4 text-base font-bold rounded-3xl",
    icon: "p-3 rounded-full",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
