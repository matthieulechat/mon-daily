interface ThemePileProps {
  title: string;
  hint: string;
  color: string;
  covers: (string | undefined)[];
  active: number;
  total: number;
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
  selected,
  onSelect,
}: ThemePileProps) => (
  <button
    type="button"
    className="pile"
    aria-pressed={selected}
    onClick={onSelect}
    style={{ "--c": color } as React.CSSProperties}
  >
    <span className="pile-count">
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
