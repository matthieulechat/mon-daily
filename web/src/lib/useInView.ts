import { useEffect, useState } from "react";

// Un seul IntersectionObserver partagé par toutes les pochettes : sert à ne
// faire tourner que celles qui sont à l'écran (63 animations sinon).
const callbacks = new WeakMap<Element, (inView: boolean) => void>();
let observer: IntersectionObserver | null = null;

const getObserver = (): IntersectionObserver => {
  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => callbacks.get(e.target)?.(e.isIntersecting)),
    { rootMargin: "120px" },
  );
  return observer;
};

export const useInView = <T extends Element>() => {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const io = getObserver();
    callbacks.set(node, setInView);
    io.observe(node);
    return () => {
      io.unobserve(node);
      callbacks.delete(node);
    };
  }, [node]);

  return [setNode, inView] as const;
};
