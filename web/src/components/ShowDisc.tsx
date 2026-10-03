import { useInView } from "@/lib/useInView";

interface ShowDiscProps {
  name: string;
  cover?: string;
  active: boolean;
  index: number;
  onToggle: () => void;
}

// Pochette de podcast en disque : tourne quand la source est dans le mix,
// grisée et à l'arrêt quand elle est exclue (ou hors écran).
export const ShowDisc = ({
  name,
  cover,
  active,
  index,
  onToggle,
}: ShowDiscProps) => {
  const [ref, inView] = useInView<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      type="button"
      className="disc"
      aria-pressed={active}
      data-spin={active && inView}
      onClick={onToggle}
    >
      <span
        className="disc-art"
        style={{ animationDelay: `-${(index * 1.7) % 14}s` }}
      >
        {cover && (
          <img
            src={cover}
            alt=""
            width={88}
            height={88}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
      </span>
      <span className="disc-name">{name}</span>
    </button>
  );
};
