import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        ghost: "border border-border text-muted hover:text-foreground",
      },
      size: {
        md: "px-5 py-2",
        sm: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = ({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
