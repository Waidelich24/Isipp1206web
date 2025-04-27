import * as XLSX from "xlsx";

export interface ScheduleEvent {
  materia: string;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string;
  fin: string;
  anio: string;
  division: string;
}

export function parseScheduleXlsx(arrayBuffer: ArrayBuffer): ScheduleEvent[] {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  // Detectar año y división en la primera celda (como "Primer Año A")
  const firstCell = (rows[0]?.[0] as string)?.trim() || "";
  const [anio, division] = extraerAnioYDivision(firstCell);

  const header = rows[1] as string[]; // ahora los días están en la segunda fila
  const parsed: ScheduleEvent[] = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];

    if (!row[0] || !String(row[0]).match(/(\d{1,2}[:,]\d{2})\s*a\s*(\d{1,2}[:,]\d{2})/)) continue;

    const [inicioRaw, finRaw] = String(row[0])
      .replace(",", ":")
      .split("a")
      .map((s) => s.trim().replace(",", ":"));

    const inicio = convertirHora(inicioRaw);
    const fin = convertirHora(finRaw);

    for (let col = 1; col <= 5; col++) {
      const dia = header[col] as ScheduleEvent["dia"];
      const celda = row[col]?.toString().trim();
      if (celda) {
        parsed.push({ materia: celda, dia, inicio, fin, anio, division });
      }
    }
  }

  return parsed;
}

function convertirHora(hora: string): string {
  return hora.includes(":") ? hora : hora.replace(",", ":");
}

function extraerAnioYDivision(texto: string): [string, string] {
  // ejemplo: "Primer Año A"
  const partes = texto.split(" ");
  const anio = partes.slice(0, 2).join(" "); // "Primer Año"
  const division = partes[2] || ""; // "A"
  return [anio, division];
}
