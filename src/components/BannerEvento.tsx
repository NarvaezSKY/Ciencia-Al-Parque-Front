import footerBanner from "@/assets/footerbanner.jpeg";

export default function BannerEvento() {
  return (
    <img
      src={footerBanner}
      alt="Ciencia al Parque · Registro de asistencias, sorteos y estadísticas en tiempo real"
      className="mx-auto block w-auto max-h-40 max-w-full object-contain px-4 py-4"
    />
  );
}
