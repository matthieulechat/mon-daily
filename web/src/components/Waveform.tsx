import { cn } from "@/lib/utils";

// Hauteurs et barres "hi" du mockup Bulletin Groove.
const BARS: { h: number; hi?: boolean }[] = [
  { h: 30 },
  { h: 70, hi: true },
  { h: 45 },
  { h: 90 },
  { h: 55, hi: true },
  { h: 35 },
  { h: 80 },
  { h: 25, hi: true },
  { h: 60 },
  { h: 40 },
  { h: 95, hi: true },
  { h: 50 },
];

export const Waveform = ({ className }: { className?: string }) => (
  <div
    className={cn("flex h-7 items-end gap-[3px] px-0.5", className)}
    aria-hidden="true"
  >
    {BARS.map(({ h, hi }, i) => (
      <span
        key={i}
        className={`wave-bar ${hi ? "bg-accent opacity-90" : "bg-primary opacity-55"}`}
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);
