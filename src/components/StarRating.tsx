import { useState } from "react";

const ESTRELLAS = [1, 2, 3, 4, 5] as const;

const pathEstrella =
  "M12 2.6l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.67l-5.9 3.1 1.13-6.57L2.45 9.54l6.6-.96L12 2.6z";

function Estrella({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill={color} aria-hidden>
      <path d={pathEstrella} />
    </svg>
  );
}

interface StarRatingProps {
  value: number;
  onChange?: (valor: number) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  className?: string;
  tamano?: string;
  etiqueta?: string;
}

export default function StarRating({
  value,
  onChange,
  onBlur,
  readOnly = false,
  className = "",
  tamano = "h-8 w-8",
  etiqueta = "Calificación"
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const valor = Number.isFinite(value) ? value : 0;

  if (readOnly) {
    const porcentaje = Math.max(0, Math.min(100, (valor / 5) * 100));
    return (
      <div className={`relative inline-flex ${className}`} aria-label={`${etiqueta}: ${valor} de 5`}>
        <div className="flex gap-1 text-slate-600">
          {ESTRELLAS.map((n) => (
            <span key={n} className={tamano}>
              <Estrella color="currentColor" />
            </span>
          ))}
        </div>
        <div
          className="absolute inset-0 flex gap-1 overflow-hidden text-[#fbbc04]"
          style={{ width: `${porcentaje}%` }}
          aria-hidden
        >
          {ESTRELLAS.map((n) => (
            <span key={n} className={`${tamano} shrink-0`}>
              <Estrella color="currentColor" />
            </span>
          ))}
        </div>
      </div>
    );
  }

  const activo = hover || valor;

  return (
    <div
      role="radiogroup"
      aria-label={etiqueta}
      className={`flex items-center gap-1 ${className}`}
      onMouseLeave={() => setHover(0)}
    >
      {ESTRELLAS.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
          className={`${tamano} transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded ${
            n <= activo ? "text-[#fbbc04]" : "text-slate-300"
          }`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={onBlur}
          onClick={() => onChange?.(n)}
        >
          <Estrella color="currentColor" />
        </button>
      ))}
    </div>
  );
}
