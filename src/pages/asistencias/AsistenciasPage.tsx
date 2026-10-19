import { Alert, Button, Card, Chip, Input, Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import StarRating from "@/components/StarRating";
import { useAsistencias } from "./hooks/useAsistencias";

const GENEROS = [
  "Masculino",
  "Femenino",
  "No binario",
  "Otro",
  "Prefiero no decirlo"
];

const PROCEDENCIAS = [
  "Institución",
  "Colegio",
  "Universidad",
  "Ciudadano",
  "Otro"
];

const LUGARES = ["Timbío", "Santander de Quilichao", "Popayán"];

const inputClasses =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const selectClasses = `${inputClasses} appearance-none`;

const labelClasses = "mb-1 block text-sm font-medium text-slate-700";

const errorClasses = "mt-1 text-xs text-red-600";

export default function AsistenciasPage() {
  const {
    documento,
    setDocumento,
    form,
    jornadaActual,
    verificacion,
    documentoVerificado,
    resultado,
    isLoading,
    onVerificar,
    onRegistrarRapido,
    onRegistrarCompleto,
    onReiniciar
  } = useAsistencias();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = form;

  const procedenciaTipo = watch("procedenciaTipo");

  if (resultado) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border border-accent/40">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Asistencia registrada</Card.Title>
            <Card.Description>{resultado.mensaje}</Card.Description>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="flex flex-wrap gap-2">
              <Chip color="success" variant="soft">
                {resultado.primeraVez ? "Primera vez" : "Ya registrado"}
              </Chip>
              <Chip color="accent" variant="soft">
                Jornada {resultado.clave}
              </Chip>
              <Chip variant="soft">{resultado.turno}</Chip>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Documento</dt>
                <dd className="font-medium">
                  {resultado.participante.documento}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Nombre</dt>
                <dd className="font-medium">
                  {resultado.participante.nombreCompleto}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Fecha</dt>
                <dd className="font-medium">{resultado.fecha}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Turno</dt>
                <dd className="font-medium">{resultado.turno}</dd>
              </div>
            </dl>

            <Button
              variant="primary"
              fullWidth
              className="mt-6"
              onPress={onReiniciar}
            >
              Registrar otra persona
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Registro de asistencia
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Verifica el documento de la persona y registra su asistencia al
          evento.
        </p>
        {jornadaActual && (
          <Chip className="mt-3" color="accent" variant="soft">
            Jornada vigente: {jornadaActual.clave} · {jornadaActual.turno}
          </Chip>
        )}
      </div>

      {!resultado && (
        <Card className="border border-slate-200">
          <Card.Content className="p-6">
            <label htmlFor="documento" className={labelClasses}>
              Documento de identidad
            </label>
            <div className="flex gap-2">
              <Input
                id="documento"
                fullWidth
                inputMode="numeric"
                placeholder="Ej. 1234567890"
                className={inputClasses}
                value={documento}
                onChange={(event) => setDocumento(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void onVerificar();
                  }
                }}
              />
              <Button
                variant="primary"
                isDisabled={isLoading}
                onPress={() => void onVerificar()}
              >
                {isLoading ? <Spinner size="sm" /> : "Verificar"}
              </Button>
            </div>

            {verificacion?.yaAsistioEnJornadaActual && (
              <Alert status="warning" className="mt-4">
                <Alert.Content>
                  <Alert.Title>Ya asistió en esta jornada</Alert.Title>
                  <Alert.Description>
                    Este documento ya tiene un registro para la jornada actual.
                    No es posible registrarlo dos veces.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            )}

            {verificacion?.existe && !verificacion.yaAsistioEnJornadaActual && (
              <div className="mt-4">
                <Alert status="success">
                  <Alert.Content>
                    <Alert.Title>Participante encontrado</Alert.Title>
                    <Alert.Description>
                      Este documento ya está registrado en el evento. Puedes
                      clonar su asistencia para la jornada actual.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
                <Button
                  variant="primary"
                  fullWidth
                  className="mt-3"
                  isDisabled={isLoading}
                  onPress={() => void onRegistrarRapido()}
                >
                  Registrar asistencia
                </Button>
              </div>
            )}

            {verificacion && !verificacion.existe && (
              <Alert status="accent" className="mt-4">
                <Alert.Content>
                  <Alert.Title>Nuevo participante</Alert.Title>
                  <Alert.Description>
                    Este documento no está registrado. Completa el formulario
                    para crear su perfil y registrar su asistencia.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            )}
          </Card.Content>
        </Card>
      )}

      {verificacion && !verificacion.existe && !resultado && (
        <Card className="mt-6 border border-slate-200">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Datos del participante</Card.Title>
            <Card.Description>
              Documento: <strong>{documentoVerificado}</strong>
            </Card.Description>
          </Card.Header>
          <Card.Content className="p-6">
            <form
              onSubmit={handleSubmit(onRegistrarCompleto)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              noValidate
            >
              <div className="sm:col-span-2">
                <label htmlFor="nombreCompleto" className={labelClasses}>
                  Nombre completo
                </label>
                <Input
                  id="nombreCompleto"
                  fullWidth
                  placeholder="Ej. María Pérez"
                  className={inputClasses}
                  {...register("nombreCompleto", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres"
                    }
                  })}
                />
                {errors.nombreCompleto && (
                  <p className={errorClasses}>
                    {errors.nombreCompleto.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="edad" className={labelClasses}>
                  Edad
                </label>
                <Input
                  id="edad"
                  type="number"
                  fullWidth
                  className={inputClasses}
                  {...register("edad", {
                    required: "La edad es obligatoria",
                    valueAsNumber: true,
                    min: { value: 1, message: "Edad mínima 1" },
                    max: { value: 120, message: "Edad máxima 120" }
                  })}
                />
                {errors.edad && (
                  <p className={errorClasses}>{errors.edad.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="genero" className={labelClasses}>
                  Género
                </label>
                <select
                  id="genero"
                  className={selectClasses}
                  {...register("genero", { required: "Selecciona un género" })}
                >
                  <option value="">Selecciona...</option>
                  {GENEROS.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
                {errors.genero && (
                  <p className={errorClasses}>{errors.genero.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefono" className={labelClasses}>
                  Teléfono celular
                </label>
                <Input
                  id="telefono"
                  fullWidth
                  inputMode="numeric"
                  placeholder="Ej. 3001234567"
                  className={inputClasses}
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^3\d{9}$/,
                      message: "Debe ser un celular colombiano de 10 dígitos"
                    }
                  })}
                />
                {errors.telefono && (
                  <p className={errorClasses}>{errors.telefono.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="procedenciaTipo" className={labelClasses}>
                  Procedencia
                </label>
                <select
                  id="procedenciaTipo"
                  className={selectClasses}
                  {...register("procedenciaTipo", {
                    required: "Selecciona la procedencia"
                  })}
                >
                  <option value="">Selecciona...</option>
                  {PROCEDENCIAS.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
                {errors.procedenciaTipo && (
                  <p className={errorClasses}>
                    {errors.procedenciaTipo.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="procedenciaDetalle" className={labelClasses}>
                  Detalle de procedencia
                </label>
                <Input
                  id="procedenciaDetalle"
                  fullWidth
                  placeholder={
                    procedenciaTipo === "Otro"
                      ? "Especifica tu procedencia"
                      : "Opcional"
                  }
                  className={inputClasses}
                  {...register("procedenciaDetalle", {
                    validate: (value) => {
                      if (procedenciaTipo !== "Otro") return true;
                      return (
                        Boolean(value && value.trim().length > 0) ||
                        "Especifica tu procedencia"
                      );
                    },
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres"
                    }
                  })}
                />
                {errors.procedenciaDetalle && (
                  <p className={errorClasses}>
                    {errors.procedenciaDetalle.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lugarEvento" className={labelClasses}>
                  Ciudad de origen
                </label>
                <select
                  id="lugarEvento"
                  className={selectClasses}
                  {...register("lugarEvento", {
                    required: "Selecciona la ciudad"
                  })}
                >
                  <option value="">Selecciona...</option>
                  {LUGARES.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
                {errors.lugarEvento && (
                  <p className={errorClasses}>{errors.lugarEvento.message}</p>
                )}
              </div>

              <div>
                <span className={labelClasses}>Calificación del evento</span>
                <Controller
                  control={control}
                  name="calificacion"
                  rules={{
                    validate: (value) =>
                      (Number.isFinite(value) && value >= 1 && value <= 5) ||
                      "Selecciona una calificación"
                  }}
                  render={({ field }) => (
                    <div className="mt-1">
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        etiqueta="Calificación del evento"
                        tamano="h-9 w-9"
                      />
                    </div>
                  )}
                />
                {errors.calificacion && (
                  <p className={errorClasses}>
                    {errors.calificacion.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="destacado" className={labelClasses}>
                  ¿Qué te pareció el evento? (opcional)
                </label>
                <textarea
                  id="destacado"
                  rows={3}
                  maxLength={500}
                  placeholder="Cuéntanos tu experiencia..."
                  className={`${inputClasses} resize-y`}
                  {...register("destacado")}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-start gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand"
                    {...register("aceptaTratamientoDatos", {
                      validate: (value) =>
                        value === true ||
                        "Debes aceptar el tratamiento de datos (Ley 1581)"
                    })}
                  />
                  <span>
                    Autorizo el tratamiento de mis datos personales con fines
                    estadísticos y administrativos del evento, conforme a la
                    Ley 1581 de 2012 (Habeas Data).
                  </span>
                </label>
                {errors.aceptaTratamientoDatos && (
                  <p className={errorClasses}>
                    {errors.aceptaTratamientoDatos.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isDisabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : "Registrar asistencia"}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
