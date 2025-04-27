"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { readCorrelativasFromExcel, MateriaCorrelativa } from "@/lib/readCorrelativas";
import SubjectLamp from "@/components/SubjectLamp";

interface CorrelativasVisualProps {
  carreraId: string;
  className?: string;
}

export default function CorrelativasVisual({ 
  carreraId, 
  className = "" 
}: CorrelativasVisualProps) {
  // Estados del componente
  const [materias, setMaterias] = useState<MateriaCorrelativa[]>([]);
  const [lampStates, setLampStates] = useState<Record<string, boolean>>({});
  const [warningFor, setWarningFor] = useState<string | null>(null);
  const [highlightChain, setHighlightChain] = useState<string[]>([]);
  const [rootDependency, setRootDependency] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // Nuevo estado para controlar animaciones

  // Mapeo de nombres de carreras
  const getCarreraName = (id: string): string => {
    const names: Record<string, string> = {
      'sistemas': 'Analista en Sistemas',
      'redes': 'Redes y Comunicación',
      'contabilidad': 'Contabilidad'
    };
    return names[id] || id;
  };

  // Cargar datos del Excel al montar el componente o cambiar carreraId
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await readCorrelativasFromExcel(carreraId);
        setMaterias(data);
        
        // Inicializar todas las lámparas como encendidas
        const initialLampStates: Record<string, boolean> = {};
        data.forEach((m) => (initialLampStates[m.materia] = true));
        setLampStates(initialLampStates);
      } catch (err) {
        console.error("Error cargando correlativas:", err);
        setError(`No se pudieron cargar las correlativas para ${getCarreraName(carreraId)}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carreraId]);

  // Mapa de materias dependientes
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

  // Apagar lámparas en secuencia
  const apagarEnSecuencia = useCallback((subjects: string[]) => {
    setIsAnimating(true);
    subjects.forEach((subject, index) => {
      setTimeout(() => {
        setLampStates((prev) => ({
          ...prev,
          [subject]: false
        }));
        // Desactivar el bloqueo cuando termine la última animación
        if (index === subjects.length - 1) {
          setTimeout(() => setIsAnimating(false), 300); // Pequeño margen adicional
        }
      }, index * 300);
    });
  }, []);

  // Encontrar la raíz de la dependencia no cumplida
  const findRootDependency = useCallback((subject: string): string | null => {
    const visited = new Set<string>();
    const queue: string[] = [subject];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const materia = materias.find(m => m.materia === current);
      if (!materia) continue;

      for (const dep of materia.correlativas) {
        if (!lampStates[dep]) {
          const depMateria = materias.find(m => m.materia === dep);
          if (depMateria && depMateria.correlativas.some(d => !lampStates[d])) {
            queue.push(dep);
          } else {
            return dep;
          }
        }
      }
    }
    return null;
  }, [materias, lampStates]);

  // Construir cadena completa de dependencias
  const buildDependencyChain = useCallback((subject: string): string[] => {
    const chain: string[] = [];
    let current = subject;
    
    while (true) {
      const root = findRootDependency(current);
      if (!root || chain.includes(root)) break;
      chain.unshift(root);
      current = root;
    }
    
    if (chain.length > 0) {
      chain.push(subject);
    }
    
    return chain;
  }, [findRootDependency]);

  // Manejar el toggle de las lámparas
  const handleToggle = useCallback(
    (name: string) => {
      // Bloquear interacción si hay animación en curso
      if (isAnimating) return;

      const materia = materias.find((m) => m.materia === name);
      if (!materia) return;

      const blocked = materia.correlativas.some((dep) => !lampStates[dep]);

      if (blocked) {
        setWarningFor(name);
        const chain = buildDependencyChain(name);
        if (chain.length > 0) {
          setHighlightChain(chain);
          setRootDependency(chain[0]);
          setIsAnimating(true);
          setTimeout(() => {
            setHighlightChain([]);
            setRootDependency(null);
            setIsAnimating(false);
          }, 4000);
        }
        return;
      }

      const newState = !lampStates[name];
      const updated = { ...lampStates, [name]: newState };
      const stack = [name];

      // Iniciar animación
      setIsAnimating(true);

      // Propagación del estado a materias dependientes
      while (stack.length) {
        const cur = stack.pop()!;
        (dependentsMap[cur] || []).forEach((dep) => {
          if (updated[dep] !== newState) {
            updated[dep] = newState;
            stack.push(dep);
          }
        });
      }

      if (newState) {
        setLampStates(updated);
        // Animación de encendido más rápida
        setTimeout(() => setIsAnimating(false), 600);
      } else {
        const toTurnOff = Object.keys(updated).filter((key) => !updated[key]);
        apagarEnSecuencia(toTurnOff);
      }
    },
    [lampStates, dependentsMap, materias, apagarEnSecuencia, buildDependencyChain, isAnimating]
  );

  // Agrupar materias por año y cuatrimestre
  const groupedByYear = useMemo(() => {
    const result: Record<number, Record<string, MateriaCorrelativa[]>> = {};

    materias.forEach((m) => {
      if (!result[m.anio]) result[m.anio] = {};
      
      // Lógica mejorada para determinar el tipo
      const key = m.tipo === "Anual" || m.cuatrimestre === 0 ? "Anual" : `C${m.cuatrimestre}`;
      
      if (!result[m.anio][key]) result[m.anio][key] = [];
      result[m.anio][key].push(m);
    });

    return result;
  }, [materias]);

  // Obtener color del cable según tipo y cuatrimestre
  const getCableColor = (tipo: string, cuatrimestre?: number) => {
    if (tipo === "Anual") return "var(--primary)";
    if (cuatrimestre === 1) return "var(--accent)";
    if (cuatrimestre === 2) return "var(--secondary)";
    return "var(--muted)";
  };

  // Renderizado durante carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Renderizado en caso de error
  if (error) {
    return (
      <div className="p-6 bg-background text-foreground">
        <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className={`p-6 bg-background text-foreground ${className}`}>
      <h1 className="text-3xl font-bold mb-6 text-center font-playfair">
        Materias y Correlativas - {getCarreraName(carreraId)}
      </h1>
      <h2 className="text-xl mb-8 text-center text-muted-foreground max-w-3xl mx-auto">
        Presione sobre el foco con el nombre de la respectiva materia para ver sus correlativas. 
        Si el foco está encendido significa que la materia está habilitada para cursar.
      </h2>
      
      <div className="flex gap-8 overflow-x-auto border-t border-b border-border py-6">
        {Object.entries(groupedByYear)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([anio, grupos]) => {
            const keysOrdenadas = Object.keys(grupos).sort((a, b) => {
              if (a === "Anual") return -1;
              if (b === "Anual") return 1;
              return parseInt(a.slice(1)) - parseInt(b.slice(1));
            });

            return (
              <div key={anio} className="flex border-l border-border px-4 gap-6">
                <div className="flex items-center justify-center min-w-[60px]">
                  <h2 className="text-lg font-semibold whitespace-nowrap">Año {anio}</h2>
                </div>

                <div className="flex gap-6">
                  {keysOrdenadas.map((clave) => {
                    const materiasGrupo = grupos[clave];
                    const titulo = clave === "Anual" ? "Anuales" : 
                                  clave.startsWith("C0") ? "Anuales" :
                                  `${clave.slice(1)}º Cuat.`;

                    return (
                      <div key={clave} className="flex flex-col items-center gap-4">
                        <h3 className="font-medium text-primary">{titulo}</h3>
                        {materiasGrupo.map((m) => (
                          <SubjectLamp
                            key={m.materia}
                            subjectName={m.materia}
                            isOn={lampStates[m.materia]}
                            isDisabled={m.correlativas.some((dep) => !lampStates[dep]) || isAnimating}
                            dependencies={m.correlativas}
                            onToggle={handleToggle}
                            cableColor={getCableColor(m.tipo, m.cuatrimestre)}
                            highlightChain={highlightChain.includes(m.materia) ? highlightChain : []}
                            rootDependency={rootDependency === m.materia ? rootDependency : null}
                            isAnimating={isAnimating}
                          />
                        ))}
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