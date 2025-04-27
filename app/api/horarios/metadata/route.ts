// app/api/horarios/list/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const horariosDir = path.join(process.cwd(), 'public', 'horarios');
    const files = await fs.readdir(horariosDir);
    
    // Filtrar solo archivos .xlsx
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    
    return NextResponse.json({ files: xlsxFiles });
  } catch (error) {
    console.error('Error leyendo directorio:', error);
    return NextResponse.json(
      { error: 'No se pudo leer el directorio de horarios' },
      { status: 500 }
    );
  }
}