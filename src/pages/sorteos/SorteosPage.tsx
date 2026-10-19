import { useState } from "react";
import { Alert, Button, Card, Chip, Input, Spinner } from "@heroui/react";
import { useSorteos } from "./hooks/useSorteos";
import SorteoOverlay from "./components/SorteoOverlay";
import DetalleGanador from "./components/DetalleGanador";
import Confetti from "@/components/Confetti";
import type { ParticipanteRes, Turno } from "@/types";

const etiquetaTurno = (turno: Turno) =>
  turno === "MANANA" ? "Mañana" : "Tarde";

const inputClasses =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClasses = "mb-1 block text-sm font-medium text-slate-700";

interface DetalleState {
  numeroSorteo: number;
  premio: string;
  documento: string;
  datos: ParticipanteRes;
}

export default function SorteosPage() {
  const {
    jornadas,
    historial,
    isLoading,
    realizando,
    sorteando,
    seleccion,
    premio,
    setPremio,
    resultado,
    alternarJornada,
    reiniciar,
    onRealizar
  } = useSorteos();

  const [detalle, setDetalle] = useState<DetalleState | null>(null);

  if (isLoading && jornadas.length === 0 && historial.length === 0) {
    return (
      <div className="flex items-center justify-center gap-3 py-24">
        <Spinner size="lg" />
        <span className="text-sm text-slate-600">Cargando sorteos...</span>
      </div>
    );
  }

  const totalElegibles = jornadas
    .filter((jornada) => seleccion.includes(jornada.id))
    .reduce((acumulado, jornada) => acumulado + jornada.totalAsistentes, 0);

  return (
    <div>
      {sorteando && (
        <SorteoOverlay premio={premio} totalElegibles={totalElegibles} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sorteos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Selecciona las jornadas participantes, define el premio y realiza el
          sorteo. Cada persona puede ganar una sola vez en el evento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-slate-200">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Nuevo sorteo</Card.Title>
            <Card.Description>
              Solo se incluyen jornadas con asistencias registradas.
            </Card.Description>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="mb-4">
              <label htmlFor="premio" className={labelClasses}>
                Premio
              </label>
              <Input
                id="premio"
                fullWidth
                placeholder="Ej. Tablet, bicicleta, entradas..."
                className={inputClasses}
                value={premio}
                onChange={(event) => setPremio(event.target.value)}
              />
            </div>

            <p className={labelClasses}>Jornadas participantes</p>
            {jornadas.length === 0 ? (
              <Alert status="warning">
                <Alert.Content>
                  <Alert.Title>Sin jornadas con registros</Alert.Title>
                  <Alert.Description>
                    Aún no hay asistencias registradas para realizar sorteos.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            ) : (
              <div className="flex flex-col gap-2">
                {jornadas.map((jornada) => {
                  const checked = seleccion.includes(jornada.id);
                  return (
                    <label
                      key={jornada.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                        checked
                          ? "border-brand bg-brand/5"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-brand"
                        checked={checked}
                        onChange={() => alternarJornada(jornada.id)}
                      />
                      <span className="font-medium text-slate-800">
                        {jornada.clave}
                      </span>
                      <span className="text-slate-500">
                        {etiquetaTurno(jornada.turno)}
                      </span>
                      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {jornada.totalAsistentes} asistencias
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                variant="primary"
                fullWidth
                isDisabled={realizando || seleccion.length === 0 || !premio.trim()}
                onPress={() => void onRealizar()}
              >
                {realizando ? <Spinner size="sm" /> : "Realizar sorteo"}
              </Button>
              <Button variant="outline" onPress={reiniciar}>
                Limpiar
              </Button>
            </div>
          </Card.Content>
        </Card>

        <div className="flex flex-col gap-6">
          {resultado && (
            <div className="animate-winner relative overflow-hidden rounded-3xl border border-accent bg-white shadow-lg">
              <Confetti count={60} />
              <Card className="relative border-0 bg-transparent">
                <Card.Header className="p-6 pb-0">
                  <Card.Title>
                    ¡Ganador del sorteo #{resultado.numeroSorteo}!
                  </Card.Title>
                  <Card.Description>
                    Premio: {resultado.premio}
                  </Card.Description>
                </Card.Header>
                <Card.Content className="p-6">
                  <p className="text-sm text-slate-500">Ganador(a)</p>
                  <p className="text-3xl font-black text-brand">
                    {resultado.ganador.datos.nombreCompleto}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Chip color="success" variant="soft">
                      {resultado.totalElegibles} elegibles
                    </Chip>
                    {resultado.jornadas.map((jornada) => (
                      <Chip key={jornada.id} variant="soft">
                        {jornada.clave}
                      </Chip>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4"
                    onPress={() =>
                      setDetalle({
                        numeroSorteo: resultado.numeroSorteo,
                        premio: resultado.premio,
                        documento: resultado.ganador.documento,
                        datos: resultado.ganador.datos
                      })
                    }
                  >
                    Ver detalles del ganador
                  </Button>
                </Card.Content>
              </Card>
            </div>
          )}

          <Card className="border border-slate-200">
            <Card.Header className="p-6 pb-0">
              <Card.Title>Historial de ganadores</Card.Title>
              <Card.Description>
                {historial.length} sorteos realizados
              </Card.Description>
            </Card.Header>
            <Card.Content className="p-6">
              {historial.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Aún no se han realizado sorteos.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-slate-100">
                  {historial.map((sorteo) => (
                    <li
                      key={sorteo._id}
                      className="flex flex-wrap items-center gap-2 py-3 text-sm"
                    >
                      <span className="font-semibold text-slate-800">
                        #{sorteo.numeroSorteo}
                      </span>
                      <span className="text-slate-700">{sorteo.premio}</span>
                      <span className="font-medium text-slate-600">
                        {sorteo.ganadorDatos?.nombreCompleto}
                      </span>
                      <span className="ml-auto flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() =>
                            setDetalle({
                              numeroSorteo: sorteo.numeroSorteo,
                              premio: sorteo.premio,
                              documento: sorteo.ganadorDocumento,
                              datos: sorteo.ganadorDatos
                            })
                          }
                        >
                          Ver detalles
                        </Button>
                        <Chip size="sm" variant="soft">
                          {sorteo.totalElegibles} elegibles
                        </Chip>
                        <span className="text-xs text-slate-400">
                          {new Date(sorteo.createdAt).toLocaleString("es-CO", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      {detalle && (
        <DetalleGanador
          numeroSorteo={detalle.numeroSorteo}
          premio={detalle.premio}
          documento={detalle.documento}
          datos={detalle.datos}
          onClose={() => setDetalle(null)}
        />
      )}
    </div>
  );
}
