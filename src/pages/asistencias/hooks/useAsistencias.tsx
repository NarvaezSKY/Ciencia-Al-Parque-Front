import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAsistenciasStore } from "@/store/asistencias.store";
import { getApiErrorMessage, getErrorBody } from "@/utils/apiError";
import type { IRegistrarReq } from "@/core/asistencias/domain/registrar";

export interface RegistrarForm {
  nombreCompleto: string;
  edad: number;
  genero: string;
  telefono: string;
  rol: string;
  tipoStaff: string;
  staffPassword: string;
  procedenciaTipo: string;
  procedenciaDetalle: string;
  municipioSeleccion: string;
  municipio: string;
  lugarEvento: string;
  fechaEvento: string;
  turnoEvento: string;
  calificacion: number;
  destacado: string;
  aceptaTratamientoDatos: boolean;
}

const DEFAULT_VALUES: RegistrarForm = {
  nombreCompleto: "",
  edad: NaN,
  genero: "",
  telefono: "",
  rol: "Publico",
  tipoStaff: "",
  staffPassword: "",
  procedenciaTipo: "",
  procedenciaDetalle: "",
  municipioSeleccion: "",
  municipio: "",
  lugarEvento: "",
  fechaEvento: "",
  turnoEvento: "",
  calificacion: NaN,
  destacado: "",
  aceptaTratamientoDatos: false
};

export const useAsistencias = () => {
  const {
    jornadasEvento,
    verificacion,
    documentoVerificado,
    resultado,
    isLoading,
    isValidandoStaff,
    claveStaffValidada,
    cargarJornadasEvento,
    verificar,
    registrar,
    validarClaveStaff,
    invalidarClaveStaff,
    reiniciar
  } = useAsistenciasStore();

  const [documento, setDocumento] = useState("");

  const form = useForm<RegistrarForm>({
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched"
  });

  const lugarEvento = form.watch("lugarEvento");
  const fechaEvento = form.watch("fechaEvento");
  const turnoEvento = form.watch("turnoEvento");

  useEffect(() => {
    void cargarJornadasEvento();
  }, [cargarJornadasEvento]);

  const lugaresEvento = useMemo(
    () => [...new Set(jornadasEvento.map((jornada) => jornada.municipio))],
    [jornadasEvento]
  );

  const fechasDisponibles = useMemo(() => {
    const fechas = jornadasEvento
      .filter((jornada) => jornada.municipio === lugarEvento)
      .map((jornada) => jornada.fecha);
    return [...new Set(fechas)].sort();
  }, [jornadasEvento, lugarEvento]);

  const turnosDisponibles = useMemo(
    () =>
      jornadasEvento.filter(
        (jornada) =>
          jornada.municipio === lugarEvento && jornada.fecha === fechaEvento
      ),
    [jornadasEvento, lugarEvento, fechaEvento]
  );

  const jornadaSeleccionada = useMemo(
    () =>
      jornadasEvento.find(
        (jornada) =>
          jornada.municipio === lugarEvento &&
          jornada.fecha === fechaEvento &&
          jornada.turno === turnoEvento
      ) ?? null,
    [jornadasEvento, lugarEvento, fechaEvento, turnoEvento]
  );

  useEffect(() => {
    if (!documentoVerificado || !jornadaSeleccionada) return;

    let cancelado = false;
    verificar(documentoVerificado, jornadaSeleccionada.id)
      .then((res) => {
        if (!cancelado && res.yaAsistioEnJornada) {
          toast.warning("Este documento ya asistió en la jornada seleccionada");
        }
      })
      .catch((err) => {
        if (!cancelado) {
          toast.error(
            getApiErrorMessage(err, "No se pudo verificar la jornada")
          );
        }
      });

    return () => {
      cancelado = true;
    };
  }, [documentoVerificado, jornadaSeleccionada, verificar]);

  const onVerificar = async () => {
    const limpio = documento.trim();
    if (!/^\d{5,12}$/.test(limpio)) {
      toast.error("El documento debe tener entre 5 y 12 dígitos");
      return;
    }
    const { rol, staffPassword } = form.getValues();
    form.reset({ ...DEFAULT_VALUES, rol, staffPassword });
    try {
      const res = await verificar(limpio);
      if (res.existe) {
        toast.success("Participante encontrado. Selecciona la jornada.");
      } else {
        toast.info("Documento nuevo: completa el registro del participante.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudo verificar el documento"));
    }
  };

  const onValidarClaveStaff = async () => {
    const password = form.getValues("staffPassword");
    if (!password) {
      form.setError("staffPassword", {
        type: "manual",
        message: "Ingresa la contraseña de staff"
      });
      return;
    }

    try {
      await validarClaveStaff(password);
      form.clearErrors("staffPassword");
      toast.success("Contraseña de staff verificada");
    } catch (err) {
      const body = getErrorBody(err);
      const message =
        body?.code === "STAFF_PASSWORD_INVALIDA"
          ? "Contraseña de staff incorrecta"
          : getApiErrorMessage(
              err,
              "No se pudo validar la contraseña de staff"
            );
      form.setError("staffPassword", { type: "manual", message });
      toast.error(message);
    }
  };

  const onCambiarRol = (opcion: string) => {
    form.setValue("rol", opcion, {
      shouldValidate: true,
      shouldTouch: true
    });

    if (opcion !== "Staff") {
      form.setValue("staffPassword", "");
      form.clearErrors("staffPassword");
      invalidarClaveStaff();
    }
  };

  const onCambiarLugarEvento = (valor: string) => {
    form.setValue("lugarEvento", valor, {
      shouldValidate: true,
      shouldTouch: true
    });
    form.setValue("fechaEvento", "");
    form.setValue("turnoEvento", "");
    form.clearErrors(["fechaEvento", "turnoEvento"]);
  };

  const onCambiarFechaEvento = (valor: string) => {
    form.setValue("fechaEvento", valor, {
      shouldValidate: true,
      shouldTouch: true
    });
    form.setValue("turnoEvento", "");
    form.clearErrors("turnoEvento");
  };

  const onCambiarTurnoEvento = (valor: string) => {
    form.setValue("turnoEvento", valor, {
      shouldValidate: true,
      shouldTouch: true
    });
  };

  const onRegistrarRapido = async () => {
    if (!documentoVerificado) return;
    if (!jornadaSeleccionada) {
      toast.error("Selecciona el lugar, el día y la jornada");
      return;
    }

    try {
      const res = await registrar({
        documento: documentoVerificado,
        jornadaId: jornadaSeleccionada.id
      });
      toast.success(res.mensaje);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Error al registrar la asistencia"));
    }
  };

  const onRegistrarCompleto = async (data: RegistrarForm) => {
    if (!documentoVerificado) return;
    if (!jornadaSeleccionada) {
      toast.error("Selecciona el lugar, el día y la jornada");
      return;
    }

    if (data.rol === "Staff" && !claveStaffValidada) {
      form.setError("staffPassword", {
        type: "manual",
        message: "Verifica la contraseña de staff antes de registrar"
      });
      toast.error("Debes verificar la contraseña de staff");
      return;
    }

    const {
      municipioSeleccion: _municipioSeleccion,
      staffPassword,
      fechaEvento: _fechaEvento,
      turnoEvento: _turnoEvento,
      lugarEvento: _lugarEvento,
      ...campos
    } = data;
    const detalle = campos.procedenciaDetalle?.trim();
    const payload: IRegistrarReq = {
      ...campos,
      documento: documentoVerificado,
      jornadaId: jornadaSeleccionada.id,
      lugarEvento: jornadaSeleccionada.municipio
    };
    if (!detalle) {
      delete payload.procedenciaDetalle;
    } else {
      payload.procedenciaDetalle = detalle;
    }
    if (payload.rol === "Staff") {
      payload.staffPassword = staffPassword;
    } else {
      delete payload.tipoStaff;
      delete payload.staffPassword;
    }

    try {
      const res = await registrar(payload);
      toast.success(res.mensaje);
    } catch (err) {
      const body = getErrorBody(err);

      if (
        body?.code === "STAFF_PASSWORD_INVALIDA" ||
        body?.code === "STAFF_PASSWORD_REQUERIDA"
      ) {
        invalidarClaveStaff();
        form.setError("staffPassword", {
          type: "manual",
          message:
            body.message ?? "Debes verificar la contraseña de staff nuevamente"
        });
        toast.error(
          body.message ?? "Debes verificar la contraseña de staff nuevamente"
        );
        return;
      }

      if (body?.code === "REQUIERE_REGISTRO_COMPLETO") {
        toast.error("Debes completar todos los datos del participante");
        body.camposFaltantes?.forEach((campo) => {
          form.setError(campo as keyof RegistrarForm, {
            type: "manual",
            message: "Este campo es obligatorio"
          });
        });
        return;
      }

      if (Array.isArray(body?.errors) && body.errors.length > 0) {
        toast.error("Revisa los datos del formulario");
        body.errors.forEach((issue) => {
          form.setError(issue.path as keyof RegistrarForm, {
            type: "manual",
            message: issue.message
          });
        });
        return;
      }

      toast.error(
        body?.message ?? "Error al registrar la asistencia"
      );
    }
  };

  const onLimpiarFormulario = () => {
    form.reset(DEFAULT_VALUES);
    invalidarClaveStaff();
  };

  const onReiniciar = () => {
    reiniciar();
    setDocumento("");
    form.reset(DEFAULT_VALUES);
  };

  return {
    documento,
    setDocumento,
    form,
    jornadasEvento,
    lugaresEvento,
    fechasDisponibles,
    turnosDisponibles,
    jornadaSeleccionada,
    verificacion,
    documentoVerificado,
    resultado,
    isLoading,
    isValidandoStaff,
    claveStaffValidada,
    onVerificar,
    onValidarClaveStaff,
    onCambiarRol,
    onCambiarLugarEvento,
    onCambiarFechaEvento,
    onCambiarTurnoEvento,
    onRegistrarRapido,
    onRegistrarCompleto,
    onLimpiarFormulario,
    onReiniciar,
    invalidarClaveStaff
  };
};
