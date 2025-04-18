"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

type Career = {
  title: string
  description: string
  icon: React.ReactNode
  details?: string[]
  sectionId?: string
}

interface FlipCardProps {
  career: Career
  index: number
}

export function FlipCard({ career, index }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { scrollToSection } = useSmoothScroll()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleViewMore = (e: React.MouseEvent) => {
    e.preventDefault()
    if (career.sectionId) {
      scrollToSection(career.sectionId)
    }
  }

  // Variantes para la animación de entrada
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  // Variantes para el icono
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.2 + 0.3,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
      },
    },
  }

  return (
    <motion.div
      className="relative h-[400px] w-full perspective-1000"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full w-full transform-style-3d card-flip-transition"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front of card */}
        <div
          className={`absolute h-full w-full backface-hidden ${
            isFlipped ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <Card className="flex h-full flex-col overflow-hidden border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 dark:bg-zinc-800">
            <CardHeader className="pb-4">
              <motion.div
                className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                variants={iconVariants}
              >
                {career.icon}
              </motion.div>
              <CardTitle className="font-playfair text-xl">{career.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{career.description}</CardDescription>
            </CardContent>
            <CardFooter className="pb-6 pt-2 flex gap-2">
              <Button
                onClick={handleFlip}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-white hover-vibrate"
              >
                Más información
              </Button>
              {career.sectionId && (
                <Button
                  onClick={handleViewMore}
                  className="flex-1 bg-primary text-white hover:bg-primary/90 hover-vibrate"
                >
                  Ver carrera
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Back of card */}
        <div
          className={`absolute h-full w-full backface-hidden rotate-y-180 ${
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <Card className="flex h-full flex-col overflow-hidden border-none bg-primary text-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-playfair text-xl">{career.title}</CardTitle>
              <CardDescription className="text-white/80">Detalles de la carrera</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <ul className="space-y-2 text-sm">
                {career.details?.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-white">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pb-6 pt-2 flex gap-2">
              <Button
                onClick={handleFlip}
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover-vibrate"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              {career.sectionId && (
                <Button
                  onClick={handleViewMore}
                  className="flex-1 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover-vibrate"
                >
                  Ver carrera
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}
