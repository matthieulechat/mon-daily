import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-semibold",
  {
    variants: {
      tone: {
        primary: "bg-primary text-primary-foreground",
        accent: "bg-accent text-primary-foreground",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

export const Badge = ({
  tone,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) => (
  <span className={cn(badgeVariants({ tone }), className)} {...props} />
);
