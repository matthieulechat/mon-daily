import { useRef } from "react";

interface KnobProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}

const DRAG_PX_FULL_RANGE = 160;

// Potard à glisser (haut/bas). Un vrai <input type="range"> masqué reste la
// base accessible : clavier, lecteurs d'écran, flèches.
export const Knob = ({
  id,
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: KnobProps) => {
  const drag = useRef<{ y: number; value: number } | null>(null);
  const ratio = (value - min) / (max - min);

  const move = (clientY: number) => {
    if (!drag.current) return;
    const raw =
      drag.current.value +
      ((drag.current.y - clientY) / DRAG_PX_FULL_RANGE) * (max - min);
    const snapped = Math.round((raw - min) / step) * step + min;
    onValueChange(Math.min(max, Math.max(min, snapped)));
  };

  return (
    <div className="knob-wrap">
      <input
        id={id}
        type="range"
        className="sr-only"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
      <div
        className="knob"
        aria-hidden="true"
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, value };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => move(e.clientY)}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <span
          className="knob-rot"
          style={{ transform: `rotate(${-135 + ratio * 270}deg)` }}
        >
          <i />
        </span>
      </div>
      <span className="knob-label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
};
