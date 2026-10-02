import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border border-border p-4", {
  variants: {
    tone: {
      default: "bg-background",
      panel: "bg-secondary rounded-2xl p-5",
    },
  },
  defaultVariants: { tone: "default" },
});

export const Card = ({
  tone,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) => (
  <div className={cn(cardVariants({ tone }), className)} {...props} />
);
