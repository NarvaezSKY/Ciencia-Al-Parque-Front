import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import type { Rol } from "@/types";

interface Props {
  role?: Rol;
}

export default function ProtectedRoute({ role }: Props) {
  const token = sessionStorage.getItem("token");
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
