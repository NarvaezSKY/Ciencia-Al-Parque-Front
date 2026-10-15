import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/utils/apiError";
import type { ILoginReq } from "@/core/auth/domain/login";

export const useLogin = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: ILoginReq) => {
    try {
      await login(data.email, data.password);
      toast.success("Iniciaste sesión exitosamente");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Error al iniciar sesión"));
    }
  };

  return { onSubmit, isLoading, error };
};
