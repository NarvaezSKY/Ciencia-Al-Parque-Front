import { toast } from "sonner";
import type { ParticipanteRes } from "@/types";

interface Props {
  numeroSorteo: number;
  premio: string;
  documento: string;
  datos: ParticipanteRes;
  onClose: () => void;
}

function Campo({
  etiqueta,
  valor,
  copiable = false
}: {
  etiqueta: string;
  valor: string | number;
  copiable?: boolean;
}) {
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(String(valor));
      toast.success(`${etiqueta} copiado`);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {etiqueta}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-900">{valor}</p>
        {copiable && (
          <button
            type="button"
            onClick={() => void copiar()}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/5"
          >
            Copiar
          </button>
        )}
      </div>
    </div>
  );
}

export default function DetalleGanador({
  numeroSorteo,
  premio,
  documento,
  datos,
  onClose
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-rise-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Detalles del ganador
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Sorteo #{numeroSorteo} · {premio}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Información privada. Verifícala en un lugar donde el público no pueda
          ver la pantalla.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo etiqueta="Nombre completo" valor={datos.nombreCompleto} />
          </div>
          <Campo etiqueta="Documento" valor={documento} copiable />
          <Campo etiqueta="Teléfono" valor={datos.telefono} copiable />
          <Campo etiqueta="Edad" valor={datos.edad} />
          <Campo etiqueta="Género" valor={datos.genero} />
          <Campo etiqueta="Procedencia" valor={datos.procedenciaTipo} />
          <Campo
            etiqueta="Municipio de procedencia"
            valor={datos.municipio}
          />
          <Campo etiqueta="Lugar del evento" valor={datos.lugarEvento} />
        </div>
      </div>
    </div>
  );
}
