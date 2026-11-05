import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Input, Spinner } from "@heroui/react";
import { Link } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import type { ILoginReq } from "@/core/auth/domain/login";

const inputClasses =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const EyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M2.06 12.35a1 1 0 0 1 0-.7C3.66 7.7 7.5 4.5 12 4.5s8.34 3.2 9.94 7.15a1 1 0 0 1 0 .7C20.34 16.3 16.5 19.5 12 19.5s-8.34-3.2-9.94-7.15Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const EyeOffIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="m3 3 18 18M10.58 10.58a2 2 0 0 0 2.83 2.83"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.88 5.09A9.94 9.94 0 0 1 12 4.5c4.5 0 8.34 3.2 9.94 7.15a1 1 0 0 1 0 .7 10.06 10.06 0 0 1-4.16 5.28M6.61 6.61A10.4 10.4 0 0 0 2.06 11.65a1 1 0 0 0 0 .7c1.6 3.95 5.44 7.15 9.94 7.15 1.31 0 2.56-.27 3.7-.75"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoginPage() {
  const { onSubmit, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  placeholder="••••••••"
                  className={`${inputClasses} pr-10`}
                  {...register("password", {
                    required: "La contraseña es obligatoria"
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
                >
                  {showPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>
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
