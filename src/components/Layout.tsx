import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import logo from "@/assets/Ciencia_al_Parque_blanco_transparente.png";
import footerBanner from "@/assets/footerbanner.jpeg";
import { useAuthStore } from "@/store/auth.store";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
    isActive
      ? "bg-white text-brand shadow-sm"
      : "text-brand-200 hover:bg-white/10"
  }`;

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Cerraste sesión");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand text-white shadow-lg shadow-brand/20">
        <nav className="mx-auto max-w-7xl px-4 py-5 flex flex-wrap items-center gap-3">
          <NavLink to="/" className="mr-4 flex items-center" aria-label="Inicio">
            <img
              src={logo}
              alt="Ciencia al Parque"
              className="h-16 w-auto drop-shadow-sm sm:h-20"
            />
          </NavLink>
          {user && (
            <NavLink to="/" className={linkClasses} end>
              Inicio
            </NavLink>
          )}
          <NavLink to="/asistencias" className={linkClasses}>
            Asistencias
          </NavLink>
          {user?.rol === "ADMIN" && (
            <NavLink to="/sorteos" className={linkClasses}>
              Sorteos
            </NavLink>
          )}

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-base text-brand-200">
                  {user.email}
                </span>
                <Button
                  size="md"
                  variant="tertiary"
                  className="!bg-red-500/80 !text-white hover:!bg-red-500"
                  onPress={() => void onLogout()}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                size="md"
                variant="tertiary"
                className="!text-accent hover:!bg-white/10"
                onPress={() => navigate("/login")}
              >
                Administrador
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full px-4 py-8">
        <div className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white">
        <hr className="border-slate-200" />
        <img
          src={footerBanner}
          alt="Ciencia al Parque · Registro de asistencias, sorteos y estadísticas en tiempo real"
          className="mx-auto block w-auto max-h-40 max-w-full object-contain px-4 py-4"
        />
      </footer>
    </div>
  );
}
