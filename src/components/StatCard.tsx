import { useEffect, useRef, useState, type ReactNode } from "react";
import AnimatedNumber from "./AnimatedNumber";

export type Accent = "brand" | "sky" | "accent" | "magenta";

interface AccentStyle {
  border: string;
  glow: string;
  value: string;
  label: string;
  icon: string;
  flash: string;
  line: string;
}

const ACCENTS: Record<Accent, AccentStyle> = {
  brand: {
    border: "border-brand/30",
    glow: "shadow-lg shadow-brand/10",
    value: "text-slate-900",
    label: "text-brand",
    icon: "bg-brand/10 text-brand ring-1 ring-brand/20",
    flash: "bg-brand text-white",
    line: "from-brand to-brand-light"
  },
  sky: {
    border: "border-brand-300/50",
    glow: "shadow-lg shadow-brand-300/20",
    value: "text-slate-900",
    label: "text-brand-light",
    icon: "bg-brand-300/15 text-brand-light ring-1 ring-brand-300/30",
    flash: "bg-brand-300 text-ink",
    line: "from-brand-300 to-brand-light"
  },
  accent: {
    border: "border-accent/60",
    glow: "shadow-lg shadow-accent/20",
    value: "text-slate-900",
    label: "text-green-600",
    icon: "bg-accent/15 text-green-600 ring-1 ring-accent/30",
    flash: "bg-accent text-ink",
    line: "from-accent to-brand-light"
  },
  magenta: {
    border: "border-magenta/30",
    glow: "shadow-lg shadow-magenta/10",
    value: "text-slate-900",
    label: "text-magenta",
    icon: "bg-magenta/10 text-magenta ring-1 ring-magenta/20",
    flash: "bg-magenta text-white",
    line: "from-magenta to-brand"
  }
};

interface Props {
  titulo: string;
  valor: number | string;
  descripcion?: string;
  accent?: Accent;
  icon?: ReactNode;
}

export default function StatCard({
  titulo,
  valor,
  descripcion,
  accent = "brand",
  icon
}: Props) {
  const style = ACCENTS[accent];
  const numeric = typeof valor === "number" ? valor : null;
  const prev = useRef(numeric);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    if (numeric === null) return;
    if (prev.current !== null && numeric > prev.current) {
      setDelta(numeric - prev.current);
      const timer = window.setTimeout(() => setDelta(0), 1800);
      prev.current = numeric;
      return () => window.clearTimeout(timer);
    }
    prev.current = numeric;
  }, [numeric]);

  return (
    <div
      className={`animate-rise-in relative overflow-hidden rounded-3xl border bg-white p-6 transition-transform duration-300 hover:-translate-y-1 ${style.border} ${style.glow}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${style.line}`}
      />

      <div className="flex items-start justify-between gap-4">
        <p
          className={`text-sm font-bold uppercase tracking-widest ${style.label}`}
        >
          {titulo}
        </p>
        {icon && (
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.icon}`}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        {numeric !== null ? (
          <AnimatedNumber
            value={numeric}
            className={`block text-6xl font-black tracking-tight xl:text-7xl ${style.value}`}
          />
        ) : (
          <span
            className={`block text-6xl font-black tracking-tight xl:text-7xl ${style.value}`}
          >
            {valor}
          </span>
        )}

        {delta > 0 && (
          <span
            className={`animate-float-up absolute left-full top-0 ml-2 rounded-full px-3 py-1 text-lg font-bold ${style.flash}`}
          >
            +{delta}
          </span>
        )}
      </div>

      {descripcion && (
        <p className="mt-3 text-sm text-slate-500">{descripcion}</p>
      )}
    </div>
  );
}
