"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Circle } from "lucide-react"

interface TimelineEvent {
  year: string
  title: string
  description: string
  image?: {
    src: string
    alt: string
  }
}

interface VerticalTimelineProps {
  events: TimelineEvent[]
  id?: string
  className?: string
}

export function VerticalTimeline({ events, id, className }: VerticalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section 
      id={id}
      ref={containerRef}
      className={cn("relative py-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900", className)}
    >
      <div className="container px-4 mx-auto">
        <motion.h2 
          className="font-playfair text-3xl font-bold text-center mb-8 text-primary"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Nuestra Historia
        </motion.h2>

        <div className="relative space-y-6">
          {/* Línea vertical central para móvil */}
          <motion.div 
            className="absolute left-6 top-0 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          
          {events.map((event, i) => {
            const isExpanded = expandedIndex === i
            
            return (
              <motion.div
                key={i}
                className="relative pl-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
              >
                {/* Punto de la línea del tiempo */}
                <motion.div 
                  className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary z-10"
                  whileHover={{ scale: 1.2 }}
                />

                {/* Contenido colapsable */}
                <motion.div
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden"
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                >
                  {/* Encabezado */}
                  <div className="p-4 flex justify-between items-center cursor-pointer">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-primary">{event.year}</h3>
                      <h4 className="text-lg font-medium text-zinc-800 dark:text-white">{event.title}</h4>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-primary" />
                    </motion.div>
                  </div>

                  {/* Contenido expandible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-3">
                          {event.description}
                        </p>
                        {event.image && (
                          <div className="relative aspect-video rounded-md overflow-hidden">
                            <Image
                              src={event.image.src}
                              alt={event.image.alt}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}