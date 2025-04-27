"use client";

import React, { useMemo } from "react";

export type ScheduleEvent = {
  materia: string;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  inicio: string;
  fin: string;
  aula?: string;
  sistema?: string;
};

interface ScheduleCalendarProps {
  events: ScheduleEvent[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
  className?: string;
}

// Lista de colores pastel/claros en formato Tailwind
const lightColorClasses = [
  'bg-blue-100/70 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  'bg-green-100/70 dark:bg-green-900/50 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
  'bg-yellow-100/70 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
  'bg-pink-100/70 dark:bg-pink-900/50 border-pink-200 dark:border-pink-700 text-pink-800 dark:text-pink-200',
  'bg-purple-100/70 dark:bg-purple-900/50 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200',
  'bg-indigo-100/70 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
  'bg-teal-100/70 dark:bg-teal-900/50 border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-200',
  'bg-orange-100/70 dark:bg-orange-900/50 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  'bg-cyan-100/70 dark:bg-cyan-900/50 border-cyan-200 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200',
  'bg-amber-100/70 dark:bg-amber-900/50 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
];

// Función para obtener un color único para cada materia
const useColorAssignment = (events: ScheduleEvent[]) => {
  return useMemo(() => {
    const colorMap = new Map<string, string>();
    const usedColors = new Set<string>();
    const availableColors = [...lightColorClasses];

    events.forEach(event => {
      if (!colorMap.has(event.materia)) {
        // Buscar el primer color disponible que no esté en uso
        let selectedColor = availableColors.find(color => !usedColors.has(color));
        
        // Si todos los colores están en uso, empezar a reutilizar desde el principio
        if (!selectedColor) {
          selectedColor = availableColors[0];
        }

        colorMap.set(event.materia, selectedColor);
        usedColors.add(selectedColor);
      }
    });

    return colorMap;
  }, [events]);
};

export default function ScheduleCalendar({ 
  events, 
  startHour: propStartHour, 
  endHour = 23, 
  hourHeight = 80,
  className = ""
}: ScheduleCalendarProps) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;
  const colorMap = useColorAssignment(events);
  
  const calculateStartHour = (events: ScheduleEvent[]) => {
    if (events.length === 0) return 8;
    
    const earliestTime = Math.min(
      ...events.map(event => {
        const [hh] = event.inicio.split(":").map(Number);
        return hh;
      })
    );
    
    return Math.max(earliestTime - 1, 0);
  };

  const startHour = propStartHour ?? calculateStartHour(events);

  const timeToMinutes = (time: string) => {
    const [hh, mm] = time.split(":").map(Number);
    return hh * 60 + mm;
  };

  const calculatePosition = (time: string) => {
    const minutes = timeToMinutes(time);
    return ((minutes - startHour * 60) / 60) * hourHeight + 4;
  };

  const calculateHeight = (inicio: string, fin: string) => {
    const start = timeToMinutes(inicio);
    const end = timeToMinutes(fin);
    return ((end - start) / 60) * hourHeight;
  };

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <div className={`overflow-auto rounded-lg border border-border shadow-sm bg-background ${className}`}>
      <div className="flex min-w-max bg-card">
        {/* Columna de horas */}
        <div className="sticky left-0 z-0 bg-muted border-r border-border">
          <div className="h-12 border-b border-border flex items-center justify-end pr-3 font-bold text-foreground">
            Hora
          </div>
          {hours.map((hour) => (
            <div 
              key={hour}
              className="flex items-end justify-end pr-2 text-sm text-muted-foreground bg-card"
              style={{ 
                height: `${hourHeight}px`,
                borderBottom: "1px solid hsl(var(--border))"
              }}
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>

        {/* Grid principal */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-5 relative">
            {/* Encabezados de días */}
            {days.map((day) => (
              <div
                key={day}
                className="sticky top-0 z-0 bg-muted p-3 text-center font-bold text-foreground border-b border-r border-border"
              >
                {day}
              </div>
            ))}

            {/* Contenedor de celdas */}
            <div 
              className="col-span-5 relative"
              style={{
                height: `${(endHour - startHour) * hourHeight}px`,
                gridColumn: "1 / span 5"
              }}
            >
              {/* Líneas horizontales de guía */}
              {hours.map((hour) => (
                <div
                  key={`line-${hour}`}
                  className="absolute w-full border-t border-border"
                  style={{
                    top: `${(hour - startHour) * hourHeight}px`
                  }}
                ></div>
              ))}

              {/* Eventos */}
              {events.map((event, idx) => {
                const top = calculatePosition(event.inicio);
                const height = calculateHeight(event.inicio, event.fin);
                const col = days.indexOf(event.dia) + 1;
                const colorClass = colorMap.get(event.materia) || lightColorClasses[0];

                return (
                  <div
                    key={`${event.dia}-${event.inicio}-${idx}`}
                    className={`absolute rounded-md border ${colorClass} shadow-sm p-2 mx-1 overflow-hidden flex flex-col hover:shadow-md transition-shadow`}
                    style={{
                      left: `${(col - 1) * 20}%`,
                      width: '18%',
                      top: `${top}px`,
                      height: `${height}px`,
                      zIndex: 0
                    }}
                  >
                    <div className="flex-grow overflow-hidden">
                      <h3 className="font-semibold text-sm leading-tight truncate">
                        {event.materia}
                      </h3>
                      <div className="text-xs opacity-80 mt-1">
                        {event.inicio} - {event.fin}
                      </div>
                      {event.aula && (
                        <div className="text-xs mt-1 italic bg-background bg-opacity-50 dark:bg-background/70 rounded px-1 truncate">
                          {event.aula}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}