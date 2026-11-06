export interface PuntoEdad {
  edad: number;
  total: number;
}

interface Rango {
  inicio: number;
  etiqueta: string;
  total: number;
}

interface LineaEdadProps {
  data: PuntoEdad[];
}

const ANCHO = 720;
const ALTO = 320;
const MARGEN = { top: 32, right: 20, bottom: 56, left: 48 };
const TICKS_Y = 4;
const MARGEN_SUPERIOR_DATOS = 1.15;

const construirRangos = (data: PuntoEdad[]): Rango[] => {
  if (data.length === 0) return [];

  const maxEdad = Math.max(...data.map((punto) => punto.edad));
  const ultimoInicio = Math.max(0, Math.floor(maxEdad / 10) * 10);

  const totales = new Map<number, number>();
  for (const { edad, total } of data) {
    const inicio = Math.max(0, Math.floor(edad / 10) * 10);
    totales.set(inicio, (totales.get(inicio) ?? 0) + total);
  }

  const rangos: Rango[] = [];
  for (let inicio = 0; inicio <= ultimoInicio; inicio += 10) {
    rangos.push({
      inicio,
      etiqueta: `${inicio}-${inicio + 9}`,
      total: totales.get(inicio) ?? 0
    });
  }
  return rangos;
};

export default function LineaEdad({ data }: LineaEdadProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Aún no hay datos de edad registrados.
      </p>
    );
  }

  const rangos = construirRangos(data);
  const anchoInterior = ANCHO - MARGEN.left - MARGEN.right;
  const altoInterior = ALTO - MARGEN.top - MARGEN.bottom;

  const maxTotal = Math.max(...rangos.map((rango) => rango.total), 1);
  const pasoY = Math.max(
    1,
    Math.ceil((maxTotal * MARGEN_SUPERIOR_DATOS) / TICKS_Y)
  );
  const maxY = pasoY * TICKS_Y;

  const xPara = (indice: number) =>
    rangos.length === 1
      ? MARGEN.left + anchoInterior / 2
      : MARGEN.left + (anchoInterior * indice) / (rangos.length - 1);
  const yPara = (valor: number) =>
    MARGEN.top + altoInterior - (valor / maxY) * altoInterior;
  const yBase = MARGEN.top + altoInterior;

  const puntos = rangos.map((rango, indice) => ({
    x: xPara(indice),
    y: yPara(rango.total),
    etiqueta: rango.etiqueta,
    total: rango.total
  }));

  const linea = puntos.map((punto) => `${punto.x},${punto.y}`).join(" ");
  const area = [
    `M ${puntos[0].x} ${yBase}`,
    ...puntos.map((punto) => `L ${punto.x} ${punto.y}`),
    `L ${puntos[puntos.length - 1].x} ${yBase}`,
    "Z"
  ].join(" ");

  const ticks = Array.from({ length: TICKS_Y + 1 }, (_, indice) => indice);

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="h-auto w-full"
      role="img"
      aria-label="Distribución de asistentes por edad"
    >
      <title>Distribución de asistentes por edad</title>
      <defs>
        <linearGradient id="area-edad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a6cae" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0a6cae" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((indice) => {
        const valor = indice * pasoY;
        const y = yPara(valor);
        return (
          <g key={indice}>
            <line
              x1={MARGEN.left}
              y1={y}
              x2={ANCHO - MARGEN.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <text
              x={MARGEN.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="#64748b"
            >
              {valor}
            </text>
          </g>
        );
      })}

      <path d={area} fill="url(#area-edad)" />

      <polyline
        points={linea}
        fill="none"
        stroke="#075187"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {puntos.map((punto) => (
        <g key={punto.etiqueta}>
          <circle
            cx={punto.x}
            cy={punto.y}
            r={5}
            fill="#ffffff"
            stroke="#075187"
            strokeWidth={3}
          >
            <title>{`${punto.etiqueta} años: ${punto.total} personas`}</title>
          </circle>
          <text
            x={punto.x}
            y={Math.max(punto.y - 12, 14)}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill="#0f172a"
          >
            {punto.total}
          </text>
        </g>
      ))}

      {rangos.map((rango, indice) => (
        <text
          key={rango.inicio}
          x={xPara(indice)}
          y={yBase + 22}
          textAnchor="middle"
          fontSize={10}
          fill="#64748b"
        >
          {rango.etiqueta}
        </text>
      ))}

      <text
        x={MARGEN.left + anchoInterior / 2}
        y={ALTO - 8}
        textAnchor="middle"
        fontSize={11}
        fill="#94a3b8"
      >
        Edad (años)
      </text>
    </svg>
  );
}
