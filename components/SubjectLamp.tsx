"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface SubjectLampProps {
  subjectName: string;
  isOn: boolean;
  isRegular: boolean;
  isSemiOn: boolean;
  onToggle: (name: string) => void;
  cableColor: string;
  highlight: boolean;
  isAnimating: boolean;
  className?: string;
  highlightApproved?: boolean;
  highlightRegular?: boolean;
  

}

const SubjectLamp: React.FC<SubjectLampProps> = ({
  subjectName,
  isOn,
  isRegular,
  isSemiOn,
  onToggle,
  cableColor,
  highlight,
  isAnimating,
  className = "",
  highlightApproved = false,
  highlightRegular = false,
  
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();
  const lastClickTime = useRef(0);

  const handleClick = () => {
    const now = Date.now();
    if (isAnimating || now - lastClickTime.current < 300) return;
    
    lastClickTime.current = now;
    onToggle(subjectName);
  };

const canInteract = !isAnimating;


const getGlowColor = () => {
  if (highlightApproved) return "rgba(74, 222, 128, 0.7)"; // verde
  if (highlightRegular) return "rgba(147, 197, 253, 0.7)"; // azul
  if (highlight && !highlightApproved && !highlightRegular) return "rgba(220, 38, 38, 0.5)"; // rojo suave solo si no hay otros
  if (isOn) return "rgba(74, 222, 128, 0.7)";
  if (isSemiOn) return "rgba(250, 204, 21, 0.5)";
  if (isRegular) return "rgba(147, 197, 253, 0.4)";
  return "rgba(0, 0, 0, 0)";
};


  const getBulbImage = () => {
    if (isOn) return "/bulb-on.png";
    if (isRegular) return "/bulb-regular.png";
    if (isSemiOn) return "/bulb-semi.png";
    return "/bulb-off.png";
  };

  return (
    <motion.div
      className={`flex flex-col items-center relative ${className}`}
      whileHover={{
        scale: canInteract ? 1.05 : 1,
        cursor: canInteract ? "pointer" : "not-allowed",
      }}
      onHoverStart={() => canInteract && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Cable */}
      <motion.div
        className="w-[2px] h-6 mb-1"
        style={{
          backgroundColor: cableColor,
          opacity: isOn ? 1 : isSemiOn ? 0.7 : isRegular ? 0.5 : 0.4,
        }}
      />

      {/* Glow */}
<motion.div
  className="absolute rounded-full blur-xl w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px]"
 animate={{
    opacity: highlightApproved || highlightRegular || isOn || isSemiOn || isRegular ? 1 : 0,
    backgroundColor: getGlowColor(),
    scale: isHovered && canInteract ? 1.05 : 1,
  }}
  transition={{
    duration: highlightApproved || highlightRegular ? 0.6 : 0.3,
    repeat: highlightApproved || highlightRegular ? Infinity : 0,
    repeatType: "reverse",
  }}
  style={{ zIndex: -1 }}
/>


      {/* Bulb */}
      <motion.img
        src={getBulbImage()}
        alt={`${subjectName}`}
        className="h-auto transition-all duration-200 w-[35px] sm:w-[65px] md:w-[75px]"
        animate={{
          opacity: isOn ? 1 : isSemiOn ? 0.8 : isRegular ? 0.7 : 0.6,
          scale: isOn ? 1 : isSemiOn ? 0.98 : isRegular ? 0.96 : 0.95,
        }}
      />

      {/* Nombre de la materia */}
      <motion.div
        className={`mt-2 px-2 py-1 text-xs text-center whitespace-normal font-medium rounded max-w-[100px] min-w-[80px] sm:text-sm sm:max-w-[120px] sm:min-w-[100px] ${
          highlight ? "bg-red-500/10" : ""
        }`}
      >
        {subjectName}
      </motion.div>
    </motion.div>
  );
};

export default SubjectLamp;