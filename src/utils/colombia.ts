import colombiaJson from "colombia-territorial/data/colombia.json";

interface Municipio {
  nombre: string;
  codigo_dane: string;
}

interface Departamento {
  nombre: string;
  codigo_dane: string;
  capital: string;
  municipios: Municipio[];
}

const departamentos = (colombiaJson as { departamentos: Departamento[] })
  .departamentos;

export const MUNICIPIOS_CAUCA = (
  departamentos.find((departamento) => departamento.nombre === "Cauca")
    ?.municipios ?? []
)
  .map((municipio) => municipio.nombre)
  .sort((a, b) => a.localeCompare(b, "es"));
