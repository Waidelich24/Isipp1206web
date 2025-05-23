import * as XLSX from "xlsx";

export type ScheduleEvent = {
  materia: string;
  profesor: string;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string;
  fin: string;
  anio?: string;
  division?: string;
  carrera?: string;
  cuatrimestre?: string;
};

export function parseScheduleXlsx(arrayBuffer: ArrayBuffer, fileName: string): ScheduleEvent[] {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

    if (workbook.SheetNames.length === 0) {
      throw new Error("El archivo Excel no contiene hojas");
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankrows: false
    });

    if (!rows || rows.length < 3) {
      throw new Error("El archivo no tiene suficientes filas con datos");
    }

    const headerRow = rows[0];
    if (
      !headerRow ||
      headerRow[1] !== "Lunes" ||
      headerRow[2] !== "Martes" ||
      headerRow[3] !== "Miércoles" ||
      headerRow[4] !== "Jueves" ||
      headerRow[5] !== "Viernes"
    ) {
      throw new Error("El archivo no tiene el formato esperado (encabezados de días incorrectos)");
    }

    const events: ScheduleEvent[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 6) continue;

      if (typeof row[0] === "string" && row[0].includes(" a ")) {
        const [inicio, fin] = row[0].split(" a ").map(t => t.trim());

        for (let col = 1; col <= 5; col++) {
          const celda = row[col]?.toString().trim();
          if (celda && celda !== "") {
            const { materia, profesor } = parseMateriaYProfesor(celda);
            const dia = getDiaByColumn(col);

            events.push({
              materia,
              profesor,
              dia,
              inicio,
              fin
            });
          }
        }
      }
    }

    if (events.length === 0) {
      throw new Error("No se encontraron horarios en el archivo");
    }

    return events;
  } catch (error) {
    console.error("Error en parseScheduleXlsx:", error);
    throw new Error(
      `Error al procesar el archivo Excel: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Modificada para aceptar espacios opcionales antes del paréntesis
function parseMateriaYProfesor(texto: string): { materia: string; profesor: string } {
  texto = texto.replace(/\s+/g, " ").trim();

  const match = texto.match(/^(.*?)\s*\((.*?)\)$/);

  if (match) {
    return {
      materia: match[1].trim(),
      profesor: match[2].trim()
    };
  }

  return {
    materia: texto,
    profesor: "Sin profesor asignado"
  };
}

function getDiaByColumn(col: number): "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" {
  switch (col) {
    case 1: return "Lunes";
    case 2: return "Martes";
    case 3: return "Miércoles";
    case 4: return "Jueves";
    case 5: return "Viernes";
    default: throw new Error(`Columna ${col} no corresponde a un día válido`);
  }
}
