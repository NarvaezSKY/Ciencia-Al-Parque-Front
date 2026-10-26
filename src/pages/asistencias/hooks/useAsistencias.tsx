import { useEffect, useState } from "react";
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
  procedenciaTipo: string;
  procedenciaDetalle: string;
  municipioSeleccion: string;
  municipio: string;
  lugarEvento: string;
  calificacion: number;
  destacado: string;
  aceptaTratamientoDatos: boolean;
}

const DEFAULT_VALUES: RegistrarForm = {
  nombreCompleto: "",
  edad: NaN,
  genero: "",
  telefono: "",
  procedenciaTipo: "",
  procedenciaDetalle: "",
  municipioSeleccion: "",
  municipio: "",
  lugarEvento: "",
  calificacion: NaN,
  destacado: "",
  aceptaTratamientoDatos: false
};

export const useAsistencias = () => {
  const {
    jornadaActual,
    verificacion,
    documentoVerificado,
    resultado,
    isLoading,
    cargarJornadaActual,
    verificar,
    registrar,
    reiniciar
  } = useAsistenciasStore();

  const [documento, setDocumento] = useState("");

  const form = useForm<RegistrarForm>({
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched"
  });

  useEffect(() => {
    void cargarJornadaActual();
  }, [cargarJornadaActual]);

  const onVerificar = async () => {
    const limpio = documento.trim();
    if (!/^\d{5,12}$/.test(limpio)) {
      toast.error("El documento debe tener entre 5 y 12 dígitos");
      return;
    }
    form.reset(DEFAULT_VALUES);
    try {
      const res = await verificar(limpio);
      if (res.yaAsistioEnJornadaActual) {
        toast.warning("Este documento ya asistió en la jornada actual");
      } else if (res.existe) {
        toast.success("Participante encontrado. Registra su asistencia.");
      } else {
        toast.info("Documento nuevo: completa el registro del participante.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudo verificar el documento"));
    }
  };

  const onRegistrarRapido = async () => {
    if (!documentoVerificado) return;
    try {
      const res = await registrar({ documento: documentoVerificado });
      toast.success(res.mensaje);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Error al registrar la asistencia"));
    }
  };

  const onRegistrarCompleto = async (data: RegistrarForm) => {
    if (!documentoVerificado) return;

    const { municipioSeleccion: _municipioSeleccion, ...campos } = data;
    const detalle = campos.procedenciaDetalle?.trim();
    const payload: IRegistrarReq = {
      ...campos,
      documento: documentoVerificado
    };
    if (!detalle) {
      delete payload.procedenciaDetalle;
    } else {
      payload.procedenciaDetalle = detalle;
    }

    try {
      const res = await registrar(payload);
      toast.success(res.mensaje);
    } catch (err) {
      const body = getErrorBody(err);

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
    jornadaActual,
    verificacion,
    documentoVerificado,
    resultado,
    isLoading,
    onVerificar,
    onRegistrarRapido,
    onRegistrarCompleto,
    onLimpiarFormulario,
    onReiniciar
  };
};
