import { useEffect, useRef, useState } from "react";
import SubjectLamp from "@/components/SubjectLamp";
import { MateriaCorrelativa } from "@/lib/readCorrelativas";

type LampState = "off" | "semi" | "regular" | "on";

interface SubjectGridProps {
  groupedByYear: Record<number, Record<string, MateriaCorrelativa[]>>;
  lampStates: Record<string, LampState>;
  handleToggle: (name: string) => void;
  getCableColor: (tipo: string, cuatrimestre?: number) => string;
  highlightChain: string[];
  isAnimating: boolean;
  initialized: boolean;
}

interface Requisito {
  aprobadas: string[];
  regularizadas: string[];
}

export default function SubjectGrid({
  groupedByYear,
  lampStates,
  handleToggle,
  getCableColor,
  highlightChain,
  isAnimating,
  initialized,
}: SubjectGridProps) {
  const [dependencyStates, setDependencyStates] = useState<Record<string, boolean>>({});
  const [currentHighlight, setCurrentHighlight] = useState<{
    subject: string;
    requisitos: Requisito;
  } | null>(null);
  const highlightTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!initialized) return;

    const updatedStates: Record<string, boolean> = {};

    Object.values(groupedByYear).forEach((grupos) => {
      Object.values(grupos).forEach((materiasGrupo) => {
        materiasGrupo.forEach((m) => {
          const allRegularOk = m.correlativas.regularizadas.every(
            dep => lampStates[dep] === "regular" || lampStates[dep] === "on"
          );
          const allApprovedOk = m.correlativas.aprobadas.every(
            dep => lampStates[dep] === "on"
          );

          updatedStates[m.materia] = allRegularOk && allApprovedOk;
        });
      });
    });

    setDependencyStates(updatedStates);
  }, [groupedByYear, lampStates, initialized]);

  const handleLampClick = (name: string) => {
    if (highlightTimeout.current) {
      clearTimeout(highlightTimeout.current);
      setCurrentHighlight(null);
    }

    const materia = Object.values(groupedByYear)
      .flatMap(g => Object.values(g).flat())
      .find(m => m.materia === name);

    if (!materia) {
      handleToggle(name);
      return;
    }

    if (lampStates[name] !== "off") {
      handleToggle(name);
      return;
    }

    const faltantesAprobadas = materia.correlativas.aprobadas.filter(dep => lampStates[dep] !== "on");
    const faltantesRegularizadas = materia.correlativas.regularizadas.filter(
      dep => lampStates[dep] !== "regular" && lampStates[dep] !== "on"
    );

    if (faltantesAprobadas.length || faltantesRegularizadas.length) {
      setCurrentHighlight({
        subject: name,
        requisitos: {
          aprobadas: faltantesAprobadas,
          regularizadas: faltantesRegularizadas,
        },
      });

      highlightTimeout.current = setTimeout(() => {
        setCurrentHighlight(null);
      }, 4000);
    }
  };

  return (
    <div className="overflow-x-auto">
            {currentHighlight && (
         <div className="mt-1 mx-auto bg-zinc-800/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-md text-sm sm:text-base max-w-md w-[90%]">


          <h4 className="font-semibold text-primary mb-2 text-center">Requisitos para cursar</h4>
          <ul className="list-none space-y-1 text-center">
            {currentHighlight.requisitos.aprobadas.length > 0 && (
              <li>
                <span className="font-medium text-green-400">✅ Aprobadas:</span>{" "}
                {currentHighlight.requisitos.aprobadas.join(", ")}
              </li>
            )}
            {currentHighlight.requisitos.regularizadas.length > 0 && (
              <li>
                <span className="font-medium text-blue-400">📘 Regularizadas:</span>{" "}
                {currentHighlight.requisitos.regularizadas.join(", ")}
              </li>
            )}
          </ul>
        </div>
      )}
      <div className="flex gap-6 sm:gap-8 border-t border-b py-4 sm:py-6 min-w-[650px]">
        {Object.entries(groupedByYear)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([anio, grupos]) => {
            const clavesOrdenadas = Object.keys(grupos).sort((a, b) =>
              a === "Anual" ? -1 : b === "Anual" ? 1 : parseInt(a.slice(1)) - parseInt(b.slice(1))
            );
return (
  <div key={anio} className="flex flex-col items-center gap-3 min-w-[200px]">
    <h2 className="text-sm sm:text-base font-semibold whitespace-nowrap text-center text-zinc-800 dark:text-zinc-100">
      {anio === "1"
        ? "Primer Año"
        : anio === "2"
        ? "Segundo Año"
        : anio === "3"
        ? "Tercer Año"
        : `Año ${anio}`}
    </h2>

    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-l px-2 sm:px-4">
      {clavesOrdenadas.map((clave) => {
        const materiasGrupo = grupos[clave];
        const titulo = clave === "Anual" ? "Anuales" : `${clave.slice(1)}º Cuat.`;

        return (
          <div key={clave} className="flex flex-col items-center gap-3">
            <h3 className="text-xs sm:text-sm font-medium text-primary">{titulo}</h3>
            {materiasGrupo.map((m) => {
              const state = lampStates[m.materia] ?? "off";

              return (
                <SubjectLamp
                  key={m.materia}
                  subjectName={m.materia}
                  isOn={state === "on"}
                  isRegular={state === "regular"}
                  isSemiOn={state === "semi"}
                  onToggle={() => handleLampClick(m.materia)}
                  cableColor={getCableColor(m.tipo, m.cuatrimestre)}
                  highlight={!!(
                    highlightChain.includes(m.materia) ||
                    currentHighlight?.requisitos.aprobadas.includes(m.materia) ||
                    currentHighlight?.requisitos.regularizadas.includes(m.materia)
                  )}
                  isAnimating={!!(isAnimating && (
                    highlightChain.includes(m.materia) ||
                    currentHighlight?.requisitos.aprobadas.includes(m.materia) ||
                    currentHighlight?.requisitos.regularizadas.includes(m.materia)
                  ))}
                  highlightApproved={currentHighlight?.requisitos.aprobadas.includes(m.materia) ?? false}
                  highlightRegular={currentHighlight?.requisitos.regularizadas.includes(m.materia) ?? false}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  </div>
);

          })}
      </div>


    </div>
  );
}
