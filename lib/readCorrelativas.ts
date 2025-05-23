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
    // Validación de carreraId
const validCarreras = ['sistemas', 'redes', 'contabilidad', 'higiene'];
    if (!validCarreras.includes(carreraId)) {
      throw new Error(`Carrera no válida: ${carreraId}. Válidas: ${validCarreras.join(', ')}`);
    }

    const filename = `correlativas-${carreraId}.xlsx`;
    const filePath = `/correlativas/${filename}`;
    const resp = await fetch(filePath);
    
    if (!resp.ok) {
      // Mensaje más descriptivo
      throw new Error(
        `No se pudo cargar el archivo: ${filePath}. ` +
        `Verifica que: \n` +
        `1. El archivo existe en la carpeta public/correlativas/\n` +
        `2. El nombre coincide exactamente\n` +
        `3. La extensión es .xlsx`
      );
    }

    const arrayBuffer = await resp.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error("El archivo Excel no contiene hojas");
    }

    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

    if (rows.length < 2) {
      throw new Error("El archivo está vacío o no tiene filas de datos");
    }

    const header = rows[0] as string[];
    const requiredColumns = ["Materia", "Año", "Cuatrimestre"];
    
    // Verificar columnas requeridas
    for (const col of requiredColumns) {
      if (!header.includes(col)) {
        throw new Error(`Falta la columna requerida: ${col}`);
      }
    }

    const materias: MateriaCorrelativa[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;

      const materia: MateriaCorrelativa = {
        materia: String(row[header.indexOf("Materia")] || "").trim(),
        anio: Number(row[header.indexOf("Año")] || 0),
        cuatrimestre: row[header.indexOf("Cuatrimestre")] === '/' ? 0 : Number(row[header.indexOf("Cuatrimestre")] || 0),
        tipo: String(row[header.indexOf("Tipo")] || "Cuat").trim(),
        correlativas: []
      };

      if (!materia.materia) {
        console.warn(`Fila ${i + 1}: Materia sin nombre, omitiendo`);
        continue;
      }

      const correlativasCell = row[header.indexOf("Correlativas")];
      if (correlativasCell) {
        materia.correlativas = String(correlativasCell)
          .split(",")
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }

      materias.push(materia);
    }

    if (materias.length === 0) {
      throw new Error("No se encontraron materias válidas en el archivo");
    }

    return materias;
  } catch (err) {
    console.error("Error leyendo correlativas:", err);
    throw err;
  }
}