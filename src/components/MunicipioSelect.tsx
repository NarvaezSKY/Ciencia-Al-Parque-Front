import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { MUNICIPIOS_CAUCA } from "@/utils/colombia";

export const OPCION_OTRO = "Otro";

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

interface MunicipioSelectProps {
  id?: string;
  value: string;
  onSelect: (opcion: string) => void;
  onBlur?: () => void;
  className?: string;
}

export default function MunicipioSelect({
  id,
  value,
  onSelect,
  onBlur,
  className
}: MunicipioSelectProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [resaltado, setResaltado] = useState(0);

  useEffect(() => {
    const manejarClickFuera = (event: MouseEvent) => {
      if (!contenedorRef.current?.contains(event.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", manejarClickFuera);
    return () => document.removeEventListener("mousedown", manejarClickFuera);
  }, []);

  const opciones = useMemo(() => {
    const termino = normalizar(consulta.trim());
    const municipios = termino
      ? MUNICIPIOS_CAUCA.filter((municipio) =>
          normalizar(municipio).includes(termino)
        )
      : MUNICIPIOS_CAUCA;
    return [OPCION_OTRO, ...municipios];
  }, [consulta]);

  const abrir = () => {
    setAbierto(true);
    setConsulta("");
    setResaltado(0);
  };

  const seleccionar = (opcion: string) => {
    onSelect(opcion);
    setConsulta("");
    setAbierto(false);
  };

  const onCambiar = (event: ChangeEvent<HTMLInputElement>) => {
    setConsulta(event.target.value);
    setResaltado(0);
    if (!abierto) setAbierto(true);
  };

  const onTecla = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!abierto) {
        abrir();
        return;
      }
      setResaltado((prev) => Math.min(prev + 1, opciones.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setResaltado((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      if (abierto && opciones[resaltado]) {
        event.preventDefault();
        seleccionar(opciones[resaltado]);
      }
    } else if (event.key === "Escape") {
      setAbierto(false);
    }
  };

  return (
    <div ref={contenedorRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={abierto}
        aria-controls="municipio-listbox"
        aria-autocomplete="list"
        autoComplete="off"
        className={className}
        placeholder="Busca tu municipio..."
        value={abierto ? consulta : value}
        onChange={onCambiar}
        onFocus={abrir}
        onKeyDown={onTecla}
        onBlur={onBlur}
      />

      {abierto && (
        <ul
          id="municipio-listbox"
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {opciones.length === 1 && (
            <li className="px-3 py-2 text-sm text-slate-500">Sin resultados</li>
          )}
          {opciones.map((opcion, index) => (
            <li
              key={opcion}
              role="option"
              aria-selected={value === opcion}
              className={`cursor-pointer px-3 py-2 text-sm ${
                index === resaltado
                  ? "bg-brand/10 text-brand"
                  : "text-slate-700"
              }`}
              onMouseEnter={() => setResaltado(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => seleccionar(opcion)}
            >
              {opcion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
