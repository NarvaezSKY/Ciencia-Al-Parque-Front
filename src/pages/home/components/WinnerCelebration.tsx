import Confetti from "@/components/Confetti";
import type { ISorteoResultado } from "@/core/sorteos/domain/realizar";

interface Props {
  sorteo: ISorteoResultado;
  onClose: () => void;
}

export default function WinnerCelebration({ sorteo, onClose }: Props) {
  const nombre = sorteo.ganador?.datos?.nombreCompleto ?? "Participante";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <Confetti count={90} />

      <div
        className="animate-winner relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-brand/50 via-ink/85 to-magenta/40 p-10 text-center shadow-[0_0_120px_-20px_rgba(61,159,221,0.9)]"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-accent ring-1 ring-white/20">
          Sorteo #{sorteo.numeroSorteo}
        </span>

        <h2 className="mt-6 bg-gradient-to-r from-brand-300 via-white to-accent bg-clip-text text-5xl font-black text-transparent xl:text-6xl">
          ¡Tenemos ganador!
        </h2>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Ganador(a)
          </p>
          <p className="mt-2 text-4xl font-black text-white xl:text-5xl">
            {nombre}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-accent/20 px-4 py-2 text-lg font-bold text-accent ring-1 ring-accent/40">
            {sorteo.premio}
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">
            {sorteo.totalElegibles} elegibles
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
