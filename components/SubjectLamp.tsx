"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SubjectLampProps {
  subjectName: string;
  isOn: boolean;
  isSemiOn: boolean;
  isEnabled: boolean;
  isDisabled: boolean;
  onToggle: (name: string) => void;
  dependencies: string[];
  cableColor: string;
  highlight: boolean;
  isAnimating: boolean;
  onFindRootDependency: (subject: string) => void;
  className?: string;
}

const SubjectLamp: React.FC<SubjectLampProps> = ({
  subjectName,
  isOn,
  isSemiOn,
  isEnabled,
  isDisabled,
  onToggle,
  dependencies,
  cableColor,
  highlight,
  isAnimating,
  onFindRootDependency,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

  // Limpieza de timeouts
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const handleClick = () => {
    if (isAnimating || isProcessing) return;
    
    setIsProcessing(true);
    
    // Lógica mejorada de manejo de clicks
    if (isOn) {
      // Si está encendida, permitir apagar
      onToggle(subjectName);
    } else if (isSemiOn && isEnabled) {
      // Solo permitir encender si está semi-activa Y habilitada
      onToggle(subjectName);
    } else if (!isDisabled) {
      // Mostrar correlativas faltantes
      onFindRootDependency(subjectName);
    }

    // Resetear el estado de procesamiento después de un breve delay
    animationRef.current = setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  };

  const canInteract = (isOn || (isSemiOn && isEnabled) || (!isDisabled && onFindRootDependency)) && !isAnimating;

  // Sistema de colores mejorado
  const getGlowColor = () => {
    if (highlight) return "rgba(220, 38, 38, 0.7)"; // Rojo para destacar
    if (isOn) return "rgba(74, 222, 128, 0.7)"; // Verde para aprobadas
    if (isSemiOn) return "rgba(250, 204, 21, 0.5)"; // Amarillo para disponibles
    return "transparent";
  };

  const getBulbImage = () => {
    if (isOn) return "/bulb-on.png";
    if (isSemiOn) return "/bulb-semi.png";
    return "/bulb-off.png";
  };

  const getTextColor = () => {
    if (highlight) return "#ef4444";
    if (isOn) return "#4ade80";
    if (isSemiOn) return "#facc15";
    return "#9ca3af";
  };

  return (
    <motion.div
      className={`flex flex-col items-center relative ${className}`}
      whileHover={{
        scale: canInteract ? 1.05 : 1,
        cursor: canInteract ? "pointer" : "not-allowed",
      }}
      onHoverStart={() => !isAnimating && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Cable superior */}
      <motion.div
        className="w-[2px] h-6 mb-1"
        style={{
          backgroundColor: cableColor,
          opacity: isOn ? 1 : isSemiOn ? 0.7 : 0.4
        }}
      />

      {/* Glow */}
      <motion.div
        className={`
          absolute rounded-full blur-xl 
          w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px]
        `}
        animate={{
          opacity: highlight || isOn || isSemiOn ? 1 : 0,
          backgroundColor: getGlowColor(),
          scale: highlight ? [1, 1.1, 1] : isHovered && canInteract ? 1.05 : 1,
        }}
        transition={{
          duration: highlight ? 0.8 : 0.3,
          repeat: highlight ? Infinity : 0,
        }}
        style={{ zIndex: -1 }}
      />

      {/* Bulb */}
      <motion.img
        src={getBulbImage()}
        alt={`${subjectName}`}
        className={`
          h-auto transition-all duration-200
          w-[35px] sm:w-[65px] md:w-[75px]
        `}
        animate={{
          opacity: isOn ? 1 : isSemiOn ? 0.8 : 0.6,
          scale: isOn ? 1 : isSemiOn ? 0.98 : 0.95,
          filter: isOn ? "brightness(1.1)" : isSemiOn ? "brightness(0.9)" : "brightness(0.7)",
        }}
      />

      {/* Subject text */}
      <motion.div
        className={`
          mt-2 px-2 py-1 text-xs text-center 
          whitespace-normal font-medium rounded
          max-w-[100px] min-w-[80px]
          sm:text-sm sm:max-w-[120px] sm:min-w-[100px]
          ${highlight ? "bg-red-500/10" : ""}
        `}
        style={{
          color: getTextColor(),
          textShadow: highlight ? "0 0 8px rgba(239, 68, 68, 0.7)" : 
                         isOn ? "0 0 8px rgba(74, 222, 128, 0.5)" : 
                         isSemiOn ? "0 0 4px rgba(250, 204, 21, 0.5)" : "none"
        }}
      >
        {subjectName}
      </motion.div>
    </motion.div>
  );
};

export default SubjectLamp;