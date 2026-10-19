import { useMemo } from "react";

const COLORS = [
  "#075187",
  "#7ed957",
  "#eb008b",
  "#0a6cae",
  "#ffffff",
  "#7cc4f0",
  "#3d9fdd"
];

interface Props {
  count?: number;
}

export default function Confetti({ count = 70 }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2.2,
        color: COLORS[index % COLORS.length],
        width: 6 + Math.random() * 8,
        height: 10 + Math.random() * 10,
        round: Math.random() > 0.5
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti absolute top-0 block"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            borderRadius: piece.round ? "9999px" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        />
      ))}
    </div>
  );
}
