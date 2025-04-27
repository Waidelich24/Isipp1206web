import * as XLSX from "xlsx";

export interface MateriaCorrelativa {
  materia: string;
  anio: number;
  cuatrimestre: number;
  tipo: string;
  correlativas: string[];
}

export async function readCorrelativasFromExcel(carreraId: string): Promise<MateriaCorrelativa[]> {
  try {
    // Usamos el ID de la carrera para cargar el archivo correspondiente
    const filename = `correlativas-${carreraId}.xlsx`;
    const resp = await fetch(`/correlativas/${filename}`);
    
    if (!resp.ok) throw new Error(`Archivo no encontrado: ${filename}`);

    const arrayBuffer = await resp.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

    if (rows.length < 2) throw new Error("El archivo está vacío");

    const header = rows[0] as string[];
    const materias: MateriaCorrelativa[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;

        // En la función que procesa cada fila:
    const materia: MateriaCorrelativa = {
      materia: String(row[header.indexOf("Materia")]),
      anio: Number(row[header.indexOf("Año")]),
      cuatrimestre: row[header.indexOf("Cuatrimestre")] === '/' ? 0 : Number(row[header.indexOf("Cuatrimestre")] || 0),
      tipo: String(row[header.indexOf("Tipo")] || "Cuat"),
      correlativas: []
    };

      const correlativasCell = row[header.indexOf("Correlativas")];
      if (correlativasCell) {
        materia.correlativas = String(correlativasCell)
          .split(",")
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }

      materias.push(materia);
    }

    return materias;
  } catch (err) {
    console.error("Error leyendo correlativas:", err);
    throw err;
  }
}