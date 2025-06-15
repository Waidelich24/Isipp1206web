import { useCallback, useEffect, useState } from "react";
import { readCorrelativasFromExcel, MateriaCorrelativa } from "@/lib/readCorrelativas";

export type LampState = "on" | "off" | "semi" | "regular";

export function useCorrelativas(carreraId: string) {
  const [materias, setMaterias] = useState<MateriaCorrelativa[]>([]);
  const [lampStates, setLampStates] = useState<Record<string, LampState>>({});
  const [warningFor, setWarningFor] = useState<string | null>(null);
  const [highlightChain, setHighlightChain] = useState<string[]>([]);
  const [missingCorrelativas, setMissingCorrelativas] = useState<{
    faltantes: string[];
    aprobadas: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null);
const [highlightedApproved, setHighlightedApproved] = useState<string[]>([]);
const [highlightedRegular, setHighlightedRegular] = useState<string[]>([]);

  const validCarreras = ["sistemas", "redes", "contabilidad", "higiene"];

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [animationTimer]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setIsInitializing(true);
      try {
        if (!validCarreras.includes(carreraId)) {
          throw new Error(`Carrera no válida: ${carreraId}`);
        }

        const data = await readCorrelativasFromExcel(carreraId);
        setMaterias(data);

        const initialStates: Record<string, LampState> = {};
        data.forEach((m) => {
          const hasCorrelativas =
            m.correlativas.aprobadas.length > 0 || m.correlativas.regularizadas.length > 0;
          initialStates[m.materia] = hasCorrelativas ? "off" : "semi";
        });
        setLampStates(initialStates);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`No se pudieron cargar las correlativas: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carreraId]);

  const tieneCorrelativasCumplidas = useCallback(
    (m: MateriaCorrelativa, estados: Record<string, LampState>) => {
      const { regularizadas, aprobadas } = m.correlativas;
      const regOk = regularizadas.every(
        (dep) => estados[dep] === "regular" || estados[dep] === "on"
      );
      const aprOk = aprobadas.every((dep) => estados[dep] === "on");
      return regOk && aprOk;
    },
    []
  );

  const obtenerCorrelativasFaltantes = useCallback(
    (m: MateriaCorrelativa, estados: Record<string, LampState>) => {
      const { regularizadas, aprobadas } = m.correlativas;
      const faltantes = [
        ...regularizadas.filter((dep) => estados[dep] !== "regular" && estados[dep] !== "on"),
        ...aprobadas.filter((dep) => estados[dep] !== "on"),
      ];
      const aprobadasCumplidas = aprobadas.filter((dep) => estados[dep] === "on");
      return { faltantes, aprobadas: aprobadasCumplidas };
    },
    []
  );

  const cascadeUpdate = useCallback(
    (updatedStates: Record<string, LampState>, changedSubject: string, isInitialUpdate = false) => {
      const updated = { ...updatedStates };
      const queue = [changedSubject];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current || visited.has(current)) continue;
        visited.add(current);

        materias.forEach((m) => {
          if ([...m.correlativas.regularizadas, ...m.correlativas.aprobadas].includes(current)) {
            const allValid = tieneCorrelativasCumplidas(m, updated);

            let newState: LampState;
            if (updated[m.materia] === "regular" || updated[m.materia] === "on") {
              newState = allValid ? updated[m.materia] : "semi";
            } else {
              newState = allValid ? "semi" : "off";
            }

            if (updated[m.materia] !== newState) {
              updated[m.materia] = newState;
              queue.push(m.materia);
              
              if (!isInitialUpdate && newState === "semi") {
                const { faltantes } = obtenerCorrelativasFaltantes(m, updated);
                if (faltantes.length > 0) {
                  setWarningFor(m.materia);
                  setHighlightChain(faltantes);
                  setMissingCorrelativas({
                    faltantes,
                    aprobadas: obtenerCorrelativasFaltantes(m, updated).aprobadas
                  });
                }
              }
            }
          }
        });
      }

      setLampStates(updated);
      if (isInitialUpdate) {
        setMissingCorrelativas(null);
        setIsInitializing(false);
        setInitialized(true);
      }
    },
    [materias, tieneCorrelativasCumplidas, obtenerCorrelativasFaltantes]
  );

  useEffect(() => {
    if (materias.length === 0 || !isInitializing) return;

    const estadosIniciales = { ...lampStates };
    materias.forEach((m) => {
      if (!(m.materia in estadosIniciales)) {
        estadosIniciales[m.materia] =
          m.correlativas.aprobadas.length === 0 && m.correlativas.regularizadas.length === 0
            ? "semi"
            : "off";
      }
    });

    let cambios = true;
    while (cambios) {
      cambios = false;
      materias.forEach((m) => {
        const currentState = estadosIniciales[m.materia];
        const allValid = tieneCorrelativasCumplidas(m, estadosIniciales);

        let newState: LampState;
        if (currentState === "regular" || currentState === "on") {
          newState = allValid ? currentState : "semi";
        } else {
          newState = allValid ? "semi" : "off";
        }

        if (newState !== currentState) {
          estadosIniciales[m.materia] = newState;
          cambios = true;
        }
      });
    }

    cascadeUpdate(estadosIniciales, Object.keys(estadosIniciales)[0], true);
  }, [materias, isInitializing, tieneCorrelativasCumplidas, cascadeUpdate]);

const handleToggle = useCallback(
  (name: string) => {
    if (isAnimating || !initialized) return;

    // Limpiar estados previos
    setWarningFor(null);
    setHighlightChain([]);
    setMissingCorrelativas(null);

    const currentState = lampStates[name];
    const materia = materias.find((m) => m.materia === name);
    if (!materia) return;

    const updated = { ...lampStates };
    const hasAllCorrelativas = tieneCorrelativasCumplidas(materia, updated);

    // Iniciar animación (pero no bloquear clicks)
    setIsAnimating(true);
    if (animationTimer) clearTimeout(animationTimer);
    setAnimationTimer(setTimeout(() => setIsAnimating(false), 300)); // Reducimos a 300ms

    if (currentState === "semi") {
      if (hasAllCorrelativas) {
        updated[name] = "regular";
        setLampStates(updated);
        cascadeUpdate(updated, name);
      } else {
        const { faltantes, aprobadas } = obtenerCorrelativasFaltantes(materia, updated);
        setWarningFor(name);
        setHighlightChain(faltantes);
        setMissingCorrelativas({ faltantes, aprobadas });
        setTimeout(() => {
          setWarningFor(null);
          setHighlightChain([]);
          setMissingCorrelativas(null);
        }, 3000);
      }
      
      return;
    }
    if (currentState === "off") {
  if (hasAllCorrelativas) {
    updated[name] = "regular";
  } else {
    const { faltantes, aprobadas } = obtenerCorrelativasFaltantes(materia, updated);
    const regularesFaltantes = faltantes.filter(f => !aprobadas.includes(f));

    setWarningFor(name);
    setHighlightChain(faltantes);
    setMissingCorrelativas({ faltantes, aprobadas });
    setHighlightedApproved(aprobadas);
    setHighlightedRegular(regularesFaltantes);

    setTimeout(() => {
      setWarningFor(null);
      setHighlightChain([]);
      setMissingCorrelativas(null);
      setHighlightedApproved([]);
      setHighlightedRegular([]);
    }, 4000);

    return;
  }
}


    switch (currentState) {
      case "regular":
        updated[name] = "on";
        break;
      case "on":
        updated[name] = "semi";
        break;
      case "off":
        if (hasAllCorrelativas) {
          updated[name] = "regular";
        } else {
          const { faltantes, aprobadas } = obtenerCorrelativasFaltantes(materia, updated);
          setWarningFor(name);
          setHighlightChain(faltantes);
          setMissingCorrelativas({ faltantes, aprobadas });
          setTimeout(() => {
            setWarningFor(null);
            setHighlightChain([]);
            setMissingCorrelativas(null);
          }, 3000);
          return;
        }
        break;
    }

    setLampStates(updated);
    cascadeUpdate(updated, name);
  },
  [lampStates, materias, isAnimating, initialized, cascadeUpdate, tieneCorrelativasCumplidas, obtenerCorrelativasFaltantes, animationTimer]
);

  const getCableColor = useCallback((tipo: string, cuatrimestre?: number) => {
    if (tipo === "Anual") return "var(--primary)";
    if (cuatrimestre === 1) return "var(--accent)";
    if (cuatrimestre === 2) return "var(--secondary)";
    return "var(--muted)";
  }, []);

return {
  materias,
  lampStates,
  loading,
  error,
  warningFor,
  highlightChain,
  isAnimating,
  handleToggle,
  getCableColor,
  missingCorrelativas,
  initialized,
  isInitializing,
  highlightedApproved,
  highlightedRegular,
};

}