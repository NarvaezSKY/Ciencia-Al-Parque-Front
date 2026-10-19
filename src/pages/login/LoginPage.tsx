import { useForm } from "react-hook-form";
import { Button, Card, Input, Spinner } from "@heroui/react";
import { Link } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import type { ILoginReq } from "@/core/auth/domain/login";

const inputClasses =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function LoginPage() {
  const { onSubmit, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginReq>({
    defaultValues: { email: "", password: "" }
  });

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md border border-slate-200">
        <Card.Header className="p-6 pb-0">
          <Card.Title>Iniciar sesión</Card.Title>
          <Card.Description>
            Ingresa con tu correo institucional para acceder al panel.
          </Card.Description>
        </Card.Header>

        <Card.Content className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                fullWidth
                placeholder="admin@cienciaalparque.co"
                className={inputClasses}
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Debe ser un correo válido"
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                fullWidth
                placeholder="••••••••"
                className={inputClasses}
                {...register("password", {
                  required: "La contraseña es obligatoria"
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Ingresar"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              ¿Necesitas registrar asistencia?{" "}
              <Link to="/asistencias" className="text-brand underline">
                Ir a asistencias
              </Link>
            </p>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
