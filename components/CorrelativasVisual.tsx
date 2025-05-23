"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { readCorrelativasFromExcel, MateriaCorrelativa } from "@/lib/readCorrelativas";
import SubjectLamp from "@/components/SubjectLamp";

interface CorrelativasVisualProps {
  carreraId: string;
  className?: string;
}

type LampState = 'on' | 'off' | 'semi';

export default function CorrelativasVisual({ carreraId, className = "" }: CorrelativasVisualProps) {
  const [materias, setMaterias] = useState<MateriaCorrelativa[]>([]);
  const [lampStates, setLampStates] = useState<Record<string, LampState>>({});
  const [warningFor, setWarningFor] = useState<string | null>(null);
  const [highlightChain, setHighlightChain] = useState<string[]>([]);
  const [rootDependency, setRootDependency] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

    const getCarreraName = (id: string): string => {
      const names: Record<string, string> = {
        sistemas: "Analista en Sistemas",
        redes: "Redes y Comunicación", 
        contabilidad: "Contabilidad",
        higiene: "Seguridad e Higiene" // Nuevo nombre para la carrera
      };
      return names[id] || id;
    };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await readCorrelativasFromExcel(carreraId);
        setMaterias(data);
        
        const initialLampStates: Record<string, LampState> = {};
        data.forEach((m) => {
          // Materias sin correlativas empiezan como 'semi' (clickeables inmediatamente)
          initialLampStates[m.materia] = m.correlativas.length === 0 ? 'semi' : 'off';
        });
        setLampStates(initialLampStates);
      } catch (err) {
        setError(`No se pudieron cargar las correlativas para ${getCarreraName(carreraId)}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [carreraId]);

  const dependentsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    materias.forEach((m) => {
      m.correlativas.forEach((pre) => {
        if (!map[pre]) map[pre] = [];
        map[pre].push(m.materia);
      });
    });
    return map;
  }, [materias]);

  const updateDependentSubjects = useCallback((updatedStates: Record<string, LampState>) => {
    const updated = { ...updatedStates };
    let changed = false;

    materias.forEach((m) => {
      if (m.correlativas.length > 0) {
        const allApproved = m.correlativas.every(dep => updated[dep] === 'on');
        const newState = allApproved ? 'semi' : 'off';
        
        if (updated[m.materia] !== newState) {
          updated[m.materia] = newState;
          changed = true;
        }
      }
    });

    if (changed) {
      setLampStates(updated);
    }
  }, [materias]);

const handleToggle = useCallback((name: string) => {
  if (isAnimating) return;

  const currentState = lampStates[name];
  const materia = materias.find((m) => m.materia === name);
  if (!materia) return;

  setIsAnimating(true);
  const updated = { ...lampStates };

  if (currentState === 'on') {
    // Al apagar, verificar si debe quedar en 'semi' u 'off'
    const correlativasAprobadas = materia.correlativas.every(dep => updated[dep] === 'on');
    updated[name] = correlativasAprobadas ? 'semi' : 'off';
    setLampStates(updated);
    
    setTimeout(() => {
      updateDependentSubjects(updated);
      setIsAnimating(false);
    }, 300);
  } 
  else if (currentState === 'semi') {
    // Verificar si se pueden encender (todas las correlativas en 'on' o no tiene correlativas)
    const puedeEncender = materia.correlativas.length === 0 || 
                         materia.correlativas.every(dep => updated[dep] === 'on');
    
    if (puedeEncender) {
      updated[name] = 'on';
      setLampStates(updated);
      
      setTimeout(() => {
        // Actualizar solo las materias que dependen de esta
        const nuevasDependientes = materias.filter(m => 
          m.correlativas.includes(name) && 
          m.correlativas.every(dep => dep === name || updated[dep] === 'on')
        );
        
        if (nuevasDependientes.length > 0) {
          const nuevosEstados = { ...updated };
          nuevasDependientes.forEach(m => {
            if (nuevosEstados[m.materia] !== 'semi') {
              nuevosEstados[m.materia] = 'semi';
            }
          });
          setLampStates(nuevosEstados);
        }
        
        setIsAnimating(false);
      }, 300);
    } else {
      // Mostrar advertencia con correlativas faltantes
      setWarningFor(name);
      setHighlightChain(materia.correlativas.filter(dep => updated[dep] !== 'on'));
      setIsAnimating(false);
    }
  }
}, [lampStates, materias, isAnimating, updateDependentSubjects]);

  const groupedByYear = useMemo(() => {
    const result: Record<number, Record<string, MateriaCorrelativa[]>> = {};
    materias.forEach((m) => {
      if (!result[m.anio]) result[m.anio] = {};
      const key = m.tipo === "Anual" || m.cuatrimestre === 0 ? "Anual" : `C${m.cuatrimestre}`;
      if (!result[m.anio][key]) result[m.anio][key] = [];
      result[m.anio][key].push(m);
    });
    return result;
  }, [materias]);

  const getCableColor = (tipo: string, cuatrimestre?: number) => {
    if (tipo === "Anual") return "var(--primary)";
    if (cuatrimestre === 1) return "var(--accent)";
    if (cuatrimestre === 2) return "var(--secondary)";
    return "var(--muted)";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 text-foreground ${className}`}>
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center font-playfair">
        Materias y Correlativas - {getCarreraName(carreraId)}
      </h1>
      <h2 className="text-sm sm:text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-4">
        Presione sobre el foco para marcar como aprobada. Estados:
        <span className="text-green-400"> ● Encendido</span> (aprobada), 
        <span className="text-yellow-300"> ● Semi-encendido</span> (disponible), 
        <span className="text-gray-400"> ● Apagado</span> (no disponible),
        <span className="text-red-400"> ● Parpadeo</span> (correlativas faltantes)
      </h2>

      {warningFor && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
          <p>Debes aprobar todas las correlativas para habilitar {warningFor}</p>
          <p className="text-sm mt-1">Correlativas faltantes: {highlightChain.join(", ")}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="flex gap-6 sm:gap-8 border-t border-b py-4 sm:py-6 min-w-[650px]">
          {Object.entries(groupedByYear)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([anio, grupos]) => {
              const keysOrdenadas = Object.keys(grupos).sort((a, b) => {
                if (a === "Anual") return -1;
                if (b === "Anual") return 1;
                return parseInt(a.slice(1)) - parseInt(b.slice(1));
              });

              return (
                <div key={anio} className="flex border-l px-2 sm:px-4 gap-4 sm:gap-6 min-w-[200px]">
                  <div className="flex items-center justify-center min-w-[50px]">
                    <h2 className="text-sm sm:text-base font-semibold whitespace-nowrap">Año {anio}</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {keysOrdenadas.map((clave) => {
                      const materiasGrupo = grupos[clave];
                      const titulo = clave === "Anual" ? "Anuales" : `${clave.slice(1)}º Cuat.`;

                      return (
                        <div key={clave} className="flex flex-col items-center gap-3">
                          <h3 className="text-xs sm:text-sm font-medium text-primary">{titulo}</h3>
                          {materiasGrupo.map((m) => {
                            const isHighlighted = highlightChain.includes(m.materia);
                            const isRootDependency = rootDependency === m.materia;
                            const isMissingDependency = isHighlighted || isRootDependency;
                            
                            return (
                              <SubjectLamp
                                key={m.materia}
                                subjectName={m.materia}
                                isOn={lampStates[m.materia] === 'on'}
                                isSemiOn={lampStates[m.materia] === 'semi'}
                                isEnabled={lampStates[m.materia] === 'semi' || lampStates[m.materia] === 'on'}
                                isDisabled={lampStates[m.materia] === 'off'}
                                onToggle={handleToggle}
                                dependencies={m.correlativas}
                                cableColor={getCableColor(m.tipo, m.cuatrimestre)}
                                highlight={isMissingDependency}
                                isAnimating={isAnimating && isMissingDependency}
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
    </div>
  );
}