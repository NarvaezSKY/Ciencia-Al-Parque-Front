import { Alert, Card, Chip, Spinner } from "@heroui/react";
import StatCard from "@/components/StatCard";
import { useDashboard } from "./hooks/useDashboard";
import type { Turno } from "@/types";

const etiquetaTurno = (turno: Turno) =>
  turno === "MANANA" ? "Mañana" : "Tarde";

interface BarraProps {
  etiqueta: string;
  total: number;
  maximo: number;
}

function Barra({ etiqueta, total, maximo }: BarraProps) {
  const porcentaje = maximo > 0 ? Math.round((total / maximo) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 truncate text-slate-600">{etiqueta}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="w-10 text-right font-medium text-slate-800">
        {total}
      </span>
    </div>
  );
}

export default function HomePage() {
  const { snapshot, conectado, isLoading, error } = useDashboard();

  if (!snapshot && isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24">
        <Spinner size="lg" />
        <span className="text-sm text-slate-600">
          Cargando estadísticas...
        </span>
      </div>
    );
  }

  if (!snapshot && error) {
    return (
      <Alert status="danger">
        <Alert.Content>
          <Alert.Title>No se pudieron cargar las estadísticas</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  if (!snapshot) {
    return null;
  }

  const maxJornada = Math.max(...snapshot.porJornada.map((item) => item.total), 1);
  const maxDia = Math.max(...snapshot.porDia.map((item) => item.total), 1);
  const maxHora = Math.max(...snapshot.ultimaHora.map((item) => item.total), 1);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard en tiempo real
        </h1>
        <Chip color={conectado ? "success" : "default"} variant="soft">
          {conectado ? "En vivo" : "Sin conexión"}
        </Chip>
        <span className="text-xs text-slate-500">
          Actualizado: {new Date(snapshot.actualizadoEn).toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          titulo="Total de asistencias"
          valor={snapshot.totalAsistencias}
          descripcion="Registros en todas las jornadas"
        />
        <StatCard
          titulo="Asistentes únicos"
          valor={snapshot.asistentesUnicos}
          descripcion="Documentos distintos"
        />
        <StatCard
          titulo="Nuevos"
          valor={snapshot.nuevos}
          descripcion="Primera vez en el evento"
        />
        <StatCard
          titulo="Recurrentes"
          valor={snapshot.recurrentes}
          descripcion="Ya habían asistido"
        />
      </div>

      <Card className="mt-6 border border-slate-200">
        <Card.Header className="p-6 pb-0">
          <Card.Title>Jornada actual</Card.Title>
          <Card.Description>
            {snapshot.jornadaActual.fecha} ·{" "}
            {etiquetaTurno(snapshot.jornadaActual.turno)}
          </Card.Description>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-700">
                {snapshot.jornadaActual.total}
              </p>
              <p className="text-sm text-slate-600">Asistencias</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">
                {snapshot.jornadaActual.primeraVez}
              </p>
              <p className="text-sm text-slate-600">Primera vez</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-2xl font-bold text-amber-700">
                {snapshot.jornadaActual.recurrentes}
              </p>
              <p className="text-sm text-slate-600">Recurrentes</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border border-slate-200">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Por jornada</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 p-6">
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
                  maximo={maxJornada}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <Card className="border border-slate-200">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Por día</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 p-6">
            {snapshot.porDia.length === 0 ? (
              <p className="text-sm text-slate-500">Sin datos todavía.</p>
            ) : (
              snapshot.porDia.map((item) => (
                <Barra
                  key={item.fecha}
                  etiqueta={item.fecha}
                  total={item.total}
                  maximo={maxDia}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <Card className="border border-slate-200">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Últimas horas</Card.Title>
            <Card.Description>Asistencias por hora</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 p-6">
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
                  maximo={maxHora}
                />
              ))
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
