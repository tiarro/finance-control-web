import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  label: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "default" | "muted" | "accent";
}

const sizeClasses = {
  sm: "text-lg font-medium",
  md: "text-xl font-semibold",
  lg: "text-2xl font-bold",
  xl: "text-3xl font-bold",
  "2xl": "text-4xl font-bold",
};

const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-primary",
};

export function Title({
  label,
  size = "md",
  as: Component = "h2",
  variant = "default",
  className,
  ...props
}: TitleProps) {
  return (
    <Component
      className={cn(sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {label}
    </Component>
  );
}
