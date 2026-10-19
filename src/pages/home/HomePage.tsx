import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import StatCard from "@/components/StatCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import MapaLugares from "@/components/MapaLugares";
import StarRating from "@/components/StarRating";
import { useDashboard } from "./hooks/useDashboard";
import WinnerCelebration from "./components/WinnerCelebration";
import { useEstadisticasStore } from "@/store/estadisticas.store";
import type { ISorteoResultado } from "@/core/sorteos/domain/realizar";
import { etiquetaTurno } from "@/utils/turno";

function useReloj() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return ahora;
}

interface BarraProps {
  etiqueta: string;
  total: number;
  maximo: number;
  color: string;
}

function Barra({ etiqueta, total, maximo, color }: BarraProps) {
  const porcentaje = maximo > 0 ? Math.round((total / maximo) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="w-40 shrink-0 truncate text-sm font-medium text-slate-600">
        {etiqueta}
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-[width] duration-700 ease-out`}
          style={{ width: `${total > 0 ? Math.max(porcentaje, 8) : 0}%` }}
        />
      </div>
      <span className="w-14 text-right text-xl font-bold tabular-nums text-slate-900">
        {total}
      </span>
    </div>
  );
}

function Panel({
  titulo,
  descripcion,
  className = "",
  children
}: {
  titulo: string;
  descripcion?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`animate-rise-in rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <h3 className="text-xl font-bold text-slate-900">{titulo}</h3>
      {descripcion && (
        <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
      )}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

const IconoPersonas = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1m14-6a4 4 0 0 0 0-8m2 14v-1a4 4 0 0 0-3-3.87M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconoEstrella = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconoSpark = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M12 3v6m0 6v6M3 12h6m6 0h6m-9.9-6.1L8.5 8.5m7 7 2.4 2.4m0-11.8-2.4 2.4m-7 7-2.4 2.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconoRefresh = (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M3 12a9 9 0 0 1 15-6.7L21 8m0-5v5h-5M21 12a9 9 0 0 1-15 6.7L3 16m0 5v-5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HomePage() {
  const { snapshot, conectado, isLoading, error } = useDashboard();
  const ahora = useReloj();
  const ultimoGanador = useEstadisticasStore((state) => state.ultimoGanador);

  const visto = useRef<string | null>(ultimoGanador?.id ?? null);
  const [celebracion, setCelebracion] = useState<ISorteoResultado | null>(null);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  useEffect(() => {
    if (ultimoGanador && ultimoGanador.id !== visto.current) {
      visto.current = ultimoGanador.id;
      setCelebracion(ultimoGanador);
      const timer = window.setTimeout(() => setCelebracion(null), 10000);
      return () => window.clearTimeout(timer);
    }
  }, [ultimoGanador]);

  useEffect(() => {
    const onChange = () =>
      setPantallaCompleta(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const alternarPantalla = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
  };

  const maximos = useMemo(
    () => ({
      jornada: snapshot
        ? Math.max(...snapshot.porJornada.map((item) => item.total), 1)
        : 1,
      dia: snapshot
        ? Math.max(...snapshot.porDia.map((item) => item.total), 1)
        : 1,
      hora: snapshot
        ? Math.max(...snapshot.ultimaHora.map((item) => item.total), 1)
        : 1
    }),
    [snapshot]
  );

  return (
    <div className="relative">
      {celebracion && (
        <WinnerCelebration
          sorteo={celebracion}
          onClose={() => setCelebracion(null)}
        />
      )}

      <div className="animate-rise-in">
        <header className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-brand via-brand-light to-accent bg-clip-text text-5xl font-black tracking-tight text-transparent xl:text-6xl">
              Ciencia al Parque
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Panel en vivo · registro, sorteos y estadísticas
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <span className="relative flex h-3 w-3">
                {conectado && (
                  <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-accent" />
                )}
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    conectado ? "bg-accent" : "bg-slate-400"
                  }`}
                />
              </span>
              {conectado ? "En vivo" : "Sin conexión"}
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-lg font-bold tabular-nums text-slate-900 shadow-sm">
              {ahora.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </span>

            <button
              type="button"
              onClick={alternarPantalla}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              {pantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
            </button>
          </div>
        </header>

        {!snapshot && isLoading && (
          <div className="mt-16 flex flex-col items-center gap-6">
            <span className="animate-spin-slow h-16 w-16 rounded-full border-4 border-slate-200 border-t-brand" />
            <p className="text-lg text-slate-500">
              Cargando estadísticas...
            </p>
          </div>
        )}

        {!snapshot && error && (
          <div className="mt-16 rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-2xl font-bold text-red-700">
              No se pudieron cargar las estadísticas
            </h2>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        )}

        {snapshot && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                titulo="Total de asistencias"
                valor={snapshot.totalAsistencias}
                descripcion="Registros en todas las jornadas"
                accent="brand"
                icon={IconoPersonas}
              />
              <StatCard
                titulo="Asistentes únicos"
                valor={snapshot.asistentesUnicos}
                descripcion="Documentos distintos"
                accent="sky"
                icon={IconoSpark}
              />
              <StatCard
                titulo="Nuevos"
                valor={snapshot.nuevos}
                descripcion="Primera vez en el evento"
                accent="accent"
                icon={IconoEstrella}
              />
              <StatCard
                titulo="Recurrentes"
                valor={snapshot.recurrentes}
                descripcion="Ya habían asistido"
                accent="magenta"
                icon={IconoRefresh}
              />
            </div>

            <div className="animate-rise-in mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand">
                    Jornada actual
                  </p>
                  <h2 className="mt-1 text-3xl font-black text-slate-900 xl:text-4xl">
                    {snapshot.jornadaActual.clave} ·{" "}
                    {etiquetaTurno(snapshot.jornadaActual.turno)}
                  </h2>
                  <p className="mt-1 text-slate-500">
                    {snapshot.jornadaActual.fecha}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand">
                    Asistencias
                  </p>
                  <AnimatedNumber
                    value={snapshot.jornadaActual.total}
                    className="mt-2 text-6xl font-black text-slate-900 xl:text-7xl"
                  />
                </div>
                <div className="rounded-2xl border border-accent/50 bg-accent/10 p-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
                    Primera vez
                  </p>
                  <AnimatedNumber
                    value={snapshot.jornadaActual.primeraVez}
                    className="mt-2 text-6xl font-black text-slate-900 xl:text-7xl"
                  />
                </div>
                <div className="rounded-2xl border border-magenta/40 bg-magenta/5 p-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-magenta">
                    Recurrentes
                  </p>
                  <AnimatedNumber
                    value={snapshot.jornadaActual.recurrentes}
                    className="mt-2 text-6xl font-black text-slate-900 xl:text-7xl"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel titulo="Por jornada">
                {snapshot.porJornada.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Aún no hay asistencias registradas.
                  </p>
                ) : (
                  snapshot.porJornada.map((item) => (
                    <Barra
                      key={item.clave}
                      etiqueta={item.clave}
                      total={item.total}
                      maximo={maximos.jornada}
                      color="from-brand to-brand-300"
                    />
                  ))
                )}
              </Panel>

              <Panel titulo="Por día">
                {snapshot.porDia.length === 0 ? (
                  <p className="text-sm text-slate-500">Sin datos todavía.</p>
                ) : (
                  snapshot.porDia.map((item) => (
                    <Barra
                      key={item.fecha}
                      etiqueta={item.fecha}
                      total={item.total}
                      maximo={maximos.dia}
                      color="from-magenta to-brand-light"
                    />
                  ))
                )}
              </Panel>

              <Panel titulo="Últimas horas" descripcion="Asistencias por hora">
                {snapshot.ultimaHora.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Sin actividad en las últimas horas.
                  </p>
                ) : (
                  snapshot.ultimaHora.map((item) => (
                    <Barra
                      key={item.hora}
                      etiqueta={item.hora}
                      total={item.total}
                      maximo={maximos.hora}
                      color="from-accent to-brand-300"
                    />
                  ))
                )}
              </Panel>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel
                titulo="Asistencias por municipio"
                descripcion="Distribución de participantes por lugar del evento"
                className="lg:col-span-2"
              >
                {snapshot.porLugar.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Aún no hay asistencias registradas por municipio.
                  </p>
                ) : (
                  <>
                    <MapaLugares data={snapshot.porLugar} />
                    <div className="flex flex-wrap gap-2">
                      {snapshot.porLugar.map((item) => (
                        <span
                          key={item.lugar}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                        >
                          {item.lugar}:{" "}
                          <strong className="text-slate-900">{item.total}</strong>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Panel>

              <Panel
                titulo="Calificación promedio"
                descripcion={
                  snapshot.calificacionVotos > 0
                    ? `${snapshot.calificacionVotos} valoraciones`
                    : undefined
                }
              >
                {snapshot.calificacionVotos === 0 ? (
                  <p className="text-sm text-slate-500">
                    Aún no hay calificaciones registradas.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <span className="text-7xl font-black text-slate-900">
                      {snapshot.calificacionPromedio.toFixed(1)}
                    </span>
                    <StarRating
                      value={snapshot.calificacionPromedio}
                      readOnly
                      tamano="h-10 w-10"
                    />
                    <p className="text-sm text-slate-500">sobre 5 estrellas</p>
                  </div>
                )}
              </Panel>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Última actualización:{" "}
              {new Date(snapshot.actualizadoEn).toLocaleTimeString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
