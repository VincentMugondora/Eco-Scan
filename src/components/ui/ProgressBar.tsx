import React from "react";
import { cn } from "../../utils/cn";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  variant?: "primary" | "warning" | "danger" | "neutral";
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  className, 
  variant,
  showLabel = false 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Dynamic color logic based on the 2026 Hackathon thresholds
  const getVariant = () => {
    if (variant) return variant;
    if (percentage < 20) return "danger";
    if (percentage < 50) return "warning";
    return "primary";
  };

  const activeVariant = getVariant();

  const variantClasses = {
    primary: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#EF4444]",
    neutral: "bg-[#64748B]",
  };

  return (
    <div className={cn("w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full transition-all duration-500 ease-out rounded-full", variantClasses[activeVariant])}
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <span className="text-[10px] font-black text-[#94A3B8] mt-1 block">
          {percentage}% Fresh
        </span>
      )}
    </div>
  );
};
