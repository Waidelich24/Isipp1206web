"use client";
import { useCorrelativas } from "./useCorrelativas";
import { useGroupedMaterias } from "../../hooks/useGroupedMaterias";
import { getCarreraName } from "@/hooks/useCarreraNombre";
import SubjectGrid from "./SubjectGrid";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useRef } from "react";
import CorrelativasHelp from "./CorrelativasHelp"

interface CorrelativasVisualProps {
  carreraId: string;
  className?: string;
}

export default function CorrelativasVisual({ carreraId, className = "" }: CorrelativasVisualProps) {
  const {
    materias,
    lampStates,
    loading,
    error,
    isAnimating,
    handleToggle,
    getCableColor,
    highlightChain,
    initialized,
  } = useCorrelativas(carreraId);

  const groupedByYear = useGroupedMaterias(materias);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className={`p-4 sm:p-6 text-foreground ${className}`}>
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center font-playfair">
        Materias y Correlativas - {getCarreraName(carreraId)}
      </h1>
      <CorrelativasHelp />
      <SubjectGrid
        groupedByYear={groupedByYear}
        lampStates={lampStates}
        handleToggle={handleToggle}
        getCableColor={getCableColor}
        highlightChain={highlightChain}
        isAnimating={isAnimating}
        initialized={initialized}
      />
    </div>
  );
} 