"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SubjectLampProps {
  subjectName: string;
  isOn: boolean;
  isDisabled: boolean;
  onToggle: (name: string) => void;
  dependencies: string[];
  cableColor: string;
  className?: string;
  highlightChain?: string[];
  rootDependency?: string | null;
  isAnimating?: boolean;
  onFindRootDependency?: (subject: string) => void;
}

const SubjectLamp: React.FC<SubjectLampProps> = ({
  subjectName,
  isOn,
  isDisabled,
  onToggle,
  dependencies,
  cableColor,
  className = "",
  highlightChain = [],
  rootDependency = null,
  isAnimating = false,
  onFindRootDependency,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInChain, setIsInChain] = useState(false);
  const [isRoot, setIsRoot] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  useEffect(() => {
    setIsInChain(highlightChain.includes(subjectName));
    setIsRoot(subjectName === rootDependency);
  }, [highlightChain, rootDependency, subjectName]);

  const handleClick = () => {
    // Bloquear si hay animación en curso
    if (isAnimating) return;

    // Permitir clic si está apagada para mostrar dependencias
    if (!isOn && onFindRootDependency) {
      onFindRootDependency(subjectName);
      return;
    }

    // Bloquear si está deshabilitada y encendida
    if (isDisabled && isOn) return;

    // Toggle normal
    onToggle(subjectName);
  };

  // Determinar si muestra cursor pointer
  const showPointer = !isAnimating && ((!isOn && onFindRootDependency) || (!isDisabled && isOn));

  return (
    <motion.div
      className={`flex flex-col items-center relative ${className}`}
      whileHover={{ 
        scale: showPointer ? 1.05 : 1,
        cursor: showPointer ? "pointer" : "not-allowed"
      }}
      onHoverStart={() => !isAnimating && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Efecto de glow */}
      <motion.div
        className="absolute w-[90px] h-[90px] rounded-full blur-xl"
        animate={{
          opacity: isRoot ? 1 : isInChain ? 0.7 : isOn ? 0.8 : 0,
          backgroundColor: isRoot 
            ? "rgba(236, 72, 153, 0.7)"
            : isInChain
              ? "rgba(99, 102, 241, 0.6)"
              : isOn
                ? "rgba(253, 230, 138, 0.6)"
                : "transparent",
          scale: isRoot ? [1, 1.1, 1] : (isHovered && showPointer ? 1.1 : 1)
        }}
        transition={{
          duration: isRoot ? 0.8 : 0.3,
          repeat: isRoot ? Infinity : 0
        }}
        style={{ zIndex: -1 }}
      />

      {/* Bombilla con animación */}
      <motion.img
        src={isOn ? "/bulb-on.png" : "/bulb-off.png"}
        alt={`${subjectName}`}
        className="w-[75px] h-auto"
        animate={{
          opacity: isOn ? 1 : 0.7,
          scale: isRoot ? [1, 1.05, 1] : isOn ? 1 : 0.95,
          filter: isOn ? "brightness(1.1)" : "brightness(0.9)",
          x: isRoot ? 
            [0, -5, 5, -5, 5, 0] : 
            (isHovered && showPointer ? [0, -3, 3, 0] : 0),
          rotate: isRoot ? 
            [0, -10, 10, -10, 10, 0] : 
            (isHovered && showPointer ? [0, -5, 5, 0] : 0)
        }}
        transition={{
          x: { duration: isRoot ? 0.8 : 0.4 },
          rotate: { duration: isRoot ? 0.8 : 0.4 },
          default: { duration: 0.3 }
        }}
      />

      {/* Nombre de la materia */}
      <motion.div 
        className="mt-2 px-3 py-1 text-sm text-center whitespace-normal max-w-[120px] min-w-[100px] font-medium"
        animate={{
          color: isRoot
            ? "#ec4899"
            : isInChain
              ? "#6366f1"
              : isOn
                ? "#fef08a"
                : "#d1d5db",
          textShadow: isRoot 
            ? "0 0 10px rgba(236, 72, 153, 0.8)" 
            : isOn 
              ? "0 0 8px rgba(254, 240, 138, 0.7)" 
              : "none",
          scale: (isHovered && showPointer ? 1.05 : 1)
        }}
        transition={{ duration: 0.2 }}
      >
        {subjectName}
      </motion.div>
    </motion.div>
  );
};

export default SubjectLamp;