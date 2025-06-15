import { useMemo } from "react";
import { MateriaCorrelativa } from "@/lib/readCorrelativas";

export function useGroupedMaterias(materias: MateriaCorrelativa[]) {
  return useMemo(() => {
    const result: Record<number, Record<string, MateriaCorrelativa[]>> = {};

    materias.forEach((m) => {
      if (!result[m.anio]) result[m.anio] = {};

      const clave = m.tipo === "Anual" || m.cuatrimestre === 0 ? "Anual" : `C${m.cuatrimestre}`;
      if (!result[m.anio][clave]) result[m.anio][clave] = [];

      result[m.anio][clave].push(m);
    });

    return result;
  }, [materias]);
}
