import type { InputHTMLAttributes } from "react";

interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}

export const Slider = ({ onValueChange, ...props }: SliderProps) => (
  <input
    type="range"
    className="slider"
    onChange={(e) => onValueChange(Number(e.target.value))}
    {...props}
  />
);
