import { useEffect, useState } from "react";

const generarDocumento = () =>
  Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");

const FRASES = [
  "Mezclando participantes",
  "Barajando documentos",
  "Eligiendo al ganador",
  "Verificando elegibles"
];

interface Props {
  premio: string;
  totalElegibles?: number;
}

export default function SorteoOverlay({ premio, totalElegibles }: Props) {
  const [documento, setDocumento] = useState(generarDocumento);
  const [fraseIndex, setFraseIndex] = useState(0);

  useEffect(() => {
    const docTimer = window.setInterval(
      () => setDocumento(generarDocumento()),
      70
    );
    const fraseTimer = window.setInterval(
      () => setFraseIndex((prev) => (prev + 1) % FRASES.length),
      1300
    );
    return () => {
      window.clearInterval(docTimer);
      window.clearInterval(fraseTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-slate-950/90 p-6 backdrop-blur-xl">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-4 border-brand/20" />
        <span className="animate-spin-slow absolute inset-0 rounded-full border-4 border-transparent border-t-brand-300 border-r-accent" />
        <span className="animate-spin-reverse absolute inset-6 rounded-full border-4 border-transparent border-b-brand border-l-magenta" />
        <span className="animate-glow-pulse absolute inset-16 rounded-full bg-gradient-to-br from-brand/50 to-magenta/40 blur-xl" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-16 w-16 text-white drop-shadow-[0_0_25px_rgba(61,159,221,0.9)]"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="bg-gradient-to-r from-brand-300 via-white to-accent bg-clip-text text-5xl font-black text-transparent xl:text-6xl">
          {FRASES[fraseIndex]}
          <span className="inline-flex gap-1 pl-1 align-middle">
            {[0, 1, 2].map((punto) => (
              <span
                key={punto}
                className="animate-glow-pulse inline-block h-2 w-2 rounded-full bg-accent"
                style={{ animationDelay: `${punto * 0.3}s` }}
              />
            ))}
          </span>
        </h2>

        <p className="mt-4 text-lg text-slate-400">
          Premio: <span className="font-semibold text-accent">{premio}</span>
          {typeof totalElegibles === "number" && (
            <span className="ml-3 text-slate-500">
              · {totalElegibles} participantes en juego
            </span>
          )}
        </p>
      </div>

      <div className="animate-shuffle rounded-2xl border border-white/10 bg-white/5 px-10 py-6 font-mono text-5xl font-black tracking-[0.35em] text-white tabular-nums xl:text-6xl">
        {documento}
      </div>

      <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
        Ciencia al Parque
      </p>
    </div>
  );
}
