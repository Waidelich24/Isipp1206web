"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ScheduleCalendar, { ScheduleEvent } from "@/components/ScheduleCalendar";

interface RedesScheduleFragmentProps {
  className?: string;
}

export default function RedesScheduleFragment({ className }: RedesScheduleFragmentProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<{ startHour: number; endHour: number }>({ 
    startHour: 8, 
    endHour: 23 
  });

  // Estado para las opciones disponibles
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  
  // Estado para las selecciones
  const [selectedYear, setSelectedYear] = useState<string>("-");
  const [selectedDivision, setSelectedDivision] = useState<string>("-");

  // Escanear la carpeta de horarios al cargar el componente
  useEffect(() => {
    const scanHorarios = async () => {
      try {
        setLoading(true);
        
        // Obtener lista de archivos (simulado - en producción usar API)
        const files = await fetchAvailableFiles("redes");
        
        // Extraer años y divisiones disponibles
        const years = new Set<string>();
        const divisions = new Set<string>();

        files.forEach(file => {
          // Formato esperado: redes-año-division.xlsx
          const [_, año, division] = file.replace('.xlsx', '').split('-');
          years.add(año);
          divisions.add(division);
        });

        setAvailableYears(Array.from(years).sort());
        setAvailableDivisions(Array.from(divisions).sort());
        
        // Seleccionar primeros valores disponibles si existen
        if (years.size > 0 && divisions.size > 0) {
          setSelectedYear(Array.from(years)[0]);
          setSelectedDivision(Array.from(divisions)[0]);
        }
        
      } catch (err) {
        console.error("Error escaneando horarios:", err);
        setError("No se pudieron cargar los horarios disponibles");
      } finally {
        setLoading(false);
      }
    };

    scanHorarios();
  }, []);

  // Cargar horario cuando cambian las selecciones
  useEffect(() => {
    if (selectedYear !== "-" && selectedDivision !== "-") {
      loadSchedule();
    }
  }, [selectedYear, selectedDivision]);

  // Función simulada para obtener archivos disponibles
  const fetchAvailableFiles = async (carrera: string): Promise<string[]> => {
    try {
      const res = await fetch('/api/horarios/list');
      const data = await res.json();
      return data.files.filter((file: string) => file.startsWith(`${carrera}-`));
    } catch {
      // Fallback para desarrollo
      return [
        "redes-3ero-a.xlsx",
        // Agrega aquí otros archivos que tengas para redes
      ];
    }
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filename = `redes-${selectedYear.toLowerCase()}-${selectedDivision.toLowerCase()}.xlsx`;
      const resp = await fetch(`/horarios/${filename}`);
      
      if (!resp.ok) throw new Error(`Horario no encontrado: ${filename}`);

      const arrayBuffer = await resp.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

      if (rows.length < 2) throw new Error("El archivo está vacío");

      const header = rows[0] as string[];
      const parsedEvents: ScheduleEvent[] = [];
      let minHour = 23;
      let maxHour = 0;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;

        const timeMatch = String(row[0]).match(/(\d{1,2}[,:]\d{2})\s*a\s*(\d{1,2}[,:]\d{2})/);
        if (!timeMatch) continue;

        const [inicio, fin] = [timeMatch[1], timeMatch[2]].map(time => {
          const [h, m] = time.replace(',', ':').split(':');
          return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
        });

        const startHour = parseInt(inicio.split(':')[0]);
        const endHour = parseInt(fin.split(':')[0]);
        
        minHour = Math.min(minHour, startHour);
        maxHour = Math.max(maxHour, endHour);

        for (let col = 1; col <= 5 && col < header.length; col++) {
          const cellContent = String(row[col] || "").trim();
          if (!cellContent) continue;

          const dia = header[col] as ScheduleEvent["dia"];
          const aulaMatch = cellContent.match(/\(([^)]+)\)$/);
          const materia = aulaMatch 
            ? cellContent.replace(aulaMatch[0], "").trim() 
            : cellContent;
          const aula = aulaMatch?.[1].trim();

          parsedEvents.push({
            materia,
            dia,
            inicio,
            fin,
            aula,
            sistema: `Redes y Comunicación ${selectedYear} ${selectedDivision}`
          });
        }
      }

      setEvents(parsedEvents);
      setTimeRange({
        startHour: Math.max(0, minHour ),
        endHour: Math.min(23, maxHour )
      });
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`p-4 md:p-8 max-w-7xl mx-auto section-gradient-2 ${className || ""}`}>
      <div className="bg-card rounded-xl shadow-lg p-6 glow-border">
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-3xl font-bold text-center md:text-left text-primary font-playfair">
            🕒 Horario de Redes y Comunicación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selector de Año */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Año:</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-2"
                disabled={loading}
              >
                <option value="-">- Seleccione -</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Selector de División */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">División:</label>
              <select 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-2"
                disabled={loading || selectedYear === "-"}
              >
                <option value="-">- Seleccione -</option>
                {availableDivisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4 mb-6 rounded">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-muted-foreground">
              {selectedYear === "-" ? "Cargando opciones..." : `Cargando horario ${selectedYear} ${selectedDivision}...`}
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            {events.length > 0 ? (
              <ScheduleCalendar 
                events={events} 
                startHour={timeRange.startHour}
                endHour={timeRange.endHour}
                hourHeight={120}
                className="bg-background"
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {selectedYear === "-" ? "Seleccione año y división" : "No se encontraron horarios"}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}