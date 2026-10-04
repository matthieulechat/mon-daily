interface ThemePileProps {
  title: string;
  hint: string;
  color: string;
  covers: (string | undefined)[];
  active: number;
  total: number;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

// Onglet de thème : 3 pochettes en éventail, compteur et jauge de sources actives.
export const ThemePile = ({
  title,
  hint,
  color,
  covers,
  active,
  total,
  index,
  selected,
  onSelect,
}: ThemePileProps) => (
  <button
    type="button"
    className="pile"
    aria-pressed={selected}
    data-off={active === 0}
    onClick={onSelect}
    style={{ "--c": color, "--i": index } as React.CSSProperties}
  >
    <span key={active} className="pile-count tick">
      {active}/{total}
    </span>
    <span className="pile-fan" aria-hidden="true">
      {covers.slice(0, 3).map((src, i) => (
        <span key={i} className="pile-disc">
          {src && <img src={src} alt="" loading="lazy" draggable={false} />}
        </span>
      ))}
    </span>
    <span className="pile-title">{title}</span>
    <span className="pile-hint">{hint}</span>
    <span className="pile-bar" aria-hidden="true">
      <b style={{ width: `${total ? (active / total) * 100 : 0}%` }} />
    </span>
  </button>
);
