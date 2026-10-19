import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { divIcon, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

const COORDENADAS: Record<string, [number, number]> = {
  "Popayán": [2.4448, -76.6147],
  "Timbío": [2.3527, -76.6816],
  "Santander de Quilichao": [3.0103, -76.4853]
};

const CENTRO: [number, number] = [2.7, -76.55];

interface MapaLugaresProps {
  data: { lugar: string; total: number }[];
  className?: string;
}

const crearIcono = (total: number, maximo: number) => {
  const proporcion = maximo > 0 ? total / maximo : 0;
  const tamano = Math.round(40 + proporcion * 28);
  const color = total >= maximo ? "#eb008b" : "#075187";

  return divIcon({
    className: "",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:${tamano}px;height:${tamano}px;border-radius:9999px;
      background:${color};color:#fff;font-weight:800;
      font-family:inherit;font-size:${tamano >= 56 ? 18 : 15}px;
      border:3px solid rgba(255,255,255,0.85);
      box-shadow:0 8px 24px rgba(0,0,0,0.45);
    ">${total}</div>`,
    iconSize: [tamano, tamano],
    iconAnchor: [tamano / 2, tamano / 2]
  });
};

export default function MapaLugares({ data, className = "" }: MapaLugaresProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const puntos = data.filter((item) => COORDENADAS[item.lugar]);
  const maximo = Math.max(...puntos.map((item) => item.total), 1);

  useEffect(() => {
    const timer = window.setTimeout(() => mapRef.current?.invalidateSize(), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      center={CENTRO}
      zoom={9}
      scrollWheelZoom={false}
      className={`z-0 h-80 w-full overflow-hidden rounded-2xl ${className}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {puntos.map((item) => (
        <Marker
          key={item.lugar}
          position={COORDENADAS[item.lugar]}
          icon={crearIcono(item.total, maximo)}
        >
          <Popup>
            <strong>{item.lugar}</strong>
            <br />
            {item.total} {item.total === 1 ? "asistencia" : "asistencias"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
