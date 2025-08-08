import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-white text-black border border-white hover:bg-gray-200",
      secondary: "bg-transparent text-white border border-gray-600 hover:bg-gray-800 hover:border-gray-500",
      outline: "bg-transparent text-white border border-gray-600 hover:bg-gray-800 hover:border-gray-500",
      ghost: "bg-transparent text-white hover:bg-gray-800",
      destructive: "bg-red-600 text-white border border-red-600 hover:bg-red-700"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-lg"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button }; 