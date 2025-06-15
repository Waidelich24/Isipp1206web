// components/CorrelativasHelpGuide.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PiLightbulbFilament,
  PiLightbulb,
  PiLightbulbFill,
  PiLightbulbDuotone,
  PiInfo,
  PiArrowRight
} from "react-icons/pi"
import { FaQuestionCircle } from "react-icons/fa"
import Image from "next/image"

type LampState = {
  id: string
  title: string
  description: string
  detail: string
  example: string
  glowColor: string
  icon: React.ReactNode
  image: string
}

const lampStates: LampState[] = [
  {
    id: "cursable",
    title: "Cursable",
    description: "Materia disponible para inscribirse",
    detail: "Puedes anotarte en esta materia porque cumpliste con los requisitos previos.",
    example: "Ejemplo: 'Matemática II' en amarillo significa que puedes inscribirte.",
    glowColor: "rgba(250, 204, 21, 0.5)",
    icon: <PiLightbulbFilament className="text-yellow-400 w-8 h-8 opacity-70" />,
    image: "/bulb-semi.png"
  },
  {
    id: "regular",
    title: "Regular",
    description: "Cursando (aprobados parciales)",
    detail: "Has aprobado los parciales pero aún no el final.",
    example: "Cuando apruebes los parciales, el foco se pondrá azul.",
    glowColor: "rgba(147, 197, 253, 0.4)",
    icon: <PiLightbulb className="text-blue-500 w-8 h-8" />,
    image: "/bulb-regular.png"
  },
  {
    id: "aprobado",
    title: "Aprobado",
    description: "Materia completada",
    detail: "¡Felicidades! Has aprobado esta materia completamente.",
    example: "Al aprobar 'Álgebra', habilita materias que la requieran.",
    glowColor: "rgba(74, 222, 128, 0.7)",
    icon: <PiLightbulbFill className="text-green-500 w-8 h-8" />,
    image: "/bulb-on.png"
  },
  {
    id: "bloqueado",
    title: "Bloqueado",
    description: "No disponible aún",
    detail: "No puedes cursar esta materia todavía.",
    example: "Haz clic para ver qué materias necesitas completar.",
    glowColor: "rgba(156, 163, 175, 0.2)",
    icon: <PiLightbulbDuotone className="text-gray-400 w-8 h-8" />,
    image: "/bulb-off.png"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
}



export default function CorrelativasHelpGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<number | null>(null)

  return (
    <div className="w-full mb-8 font-inter">
      {/* Botón de activación */}
      <div className="flex justify-center">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaQuestionCircle className="text-lg" />
          <span className="font-medium">Guía Visual de Estados</span>
        </motion.button>
      </div>

      {/* Panel desplegable con animación idéntica de apertura/cierre */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-full bg-card text-card-foreground rounded-lg shadow-2xl border border-border mt-3 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: { 
                type: "spring", 
                damping: 25,
                stiffness: 100,
                mass: 0.5,
                delay: 0.1
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { 
                type: "spring", 
                damping: 25,
                stiffness: 100,
                mass: 0.5
              }
            }}

          >
            {selectedState !== null ? (
              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.15 }
                }}
              >
                <motion.button 
                  onClick={() => setSelectedState(null)}
                  className="mb-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  whileHover={{ x: -3 }}
                >
                  <PiArrowRight className="w-4 h-4 transform rotate-180" />
                  Volver a todos los estados
                </motion.button>
                
                <motion.div
                  className={`p-6 rounded-lg border bg-secondary relative overflow-hidden ${
                    lampStates[selectedState].id === 'bloqueado' 
                      ? 'border-gray-300' 
                      : 'border-primary/30'
                  }`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  {/* Glow permanente */}
                  <div 
                    className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
                    style={{ 
                      backgroundColor: lampStates[selectedState].glowColor,
                      display: lampStates[selectedState].id === 'bloqueado' ? 'none' : 'block'
                    }}
                  />

                  <div className="relative flex justify-center mb-6">
                    {/* Glow concentrado */}
                    <div 
                      className="absolute rounded-full w-[100px] h-[100px] blur-md opacity-70"
                      style={{ 
                        backgroundColor: lampStates[selectedState].glowColor,
                        display: lampStates[selectedState].id === 'bloqueado' ? 'none' : 'block'
                      }}
                    />
                    
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    >
                      <Image 
                        src={lampStates[selectedState].image} 
                        alt={`Foco ${lampStates[selectedState].title}`}
                        width={80}
                        height={80}
                        className="object-contain drop-shadow-lg"
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <motion.div className="flex items-center gap-3" variants={itemVariants}>
                      {lampStates[selectedState].icon}
                      <h3 className="text-xl font-bold">{lampStates[selectedState].title}</h3>
                    </motion.div>
                    
                    <motion.p className="text-muted-foreground" variants={itemVariants}>
                      {lampStates[selectedState].description}
                    </motion.p>
                    
                    <motion.p className="text-sm" variants={itemVariants}>
                      {lampStates[selectedState].detail}
                    </motion.p>
                    
                    <motion.div className="p-3 bg-accent rounded border border-border" variants={itemVariants}>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <PiInfo className="text-primary" />
                        Ejemplo práctico:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {lampStates[selectedState].example}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.h3 className="text-xl font-bold mb-4 text-center" variants={itemVariants}>
                  Sistema de Correlatividades por Focos
                </motion.h3>
                
                <motion.p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto" variants={itemVariants}>
                  Cada materia se representa con un foco cuyo color y brillo indican su estado actual, para saber tu estado
                  o te gustaria consultar para que materias estas apto para cursar haz click sobre un foco y descubrelo a partir de los estados:
                </motion.p>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                  variants={containerVariants}
                >
                  {lampStates.map((state, index) => (
                    <motion.div
                      key={state.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedState(index)}
                      className={`p-5 rounded-xl border cursor-pointer ${
                        state.id === 'bloqueado' 
                          ? 'bg-gray-50 dark:bg-gray-900' 
                          : 'bg-secondary'
                      } flex flex-col items-center text-center h-full relative overflow-hidden`}
                    >
                      {/* Glow permanente */}
                      <div 
                        className="absolute inset-0 opacity-10 blur-md pointer-events-none"
                        style={{ 
                          backgroundColor: state.glowColor,
                          display: state.id === 'bloqueado' ? 'none' : 'block'
                        }}
                      />

                      {/* Glow concentrado */}
                      <div 
                        className="absolute rounded-full w-[80px] h-[80px] blur-md opacity-50 pointer-events-none"
                        style={{ 
                          backgroundColor: state.glowColor,
                          display: state.id === 'bloqueado' ? 'none' : 'block'
                        }}
                      />

                      <div className="relative mb-4 z-10">
                        <Image 
                          src={state.image} 
                          alt={`Foco ${state.title}`}
                          width={60}
                          height={60}
                          className="object-contain mx-auto drop-shadow-md"
                        />
                      </div>

                      <h4 className="font-bold mb-2 text-lg z-10">{state.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4 z-10">{state.description}</p>
                      <button className="mt-auto text-xs text-primary hover:text-primary/80 font-medium px-3 py-1.5 bg-white/50 dark:bg-black/20 rounded-full z-10">
                        Ver detalles
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="mt-8 p-4 bg-accent border border-border rounded-lg"
                  variants={itemVariants}
                >
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <PiInfo className="text-primary" />
                    ¿Sabías que...?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Haz clic en cualquier materia bloqueada para ver un efecto de destello.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}