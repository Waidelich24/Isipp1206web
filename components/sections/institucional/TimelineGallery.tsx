"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

interface TimelineEvent {
  year: string
  title: string
  description: string
  image?: {
    src: string
    alt: string
  }
}

interface HorizontalTimelineProps {
  events: TimelineEvent[]
  id?: string
  className?: string
}

export function HorizontalTimeline({ events, id, className }: HorizontalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section
      id={id}
      ref={containerRef}
      className={cn("relative py-28 bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900", className)}
    >

      <div className="w-full relative z-10">


        <motion.h2
          className="font-playfair text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Nuestra Historia
        </motion.h2>
<div className="relative w-full overflow-x-auto pb-12">
  <div className="flex items-start space-x-8 w-[max-content] h-[800px] px-8">

            {/* Línea horizontal central */}
            <motion.div
              className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent transform -translate-y-1/2 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <AnimatePresence>
              {events.map((event, i) => {
                const itemRef = useRef<HTMLDivElement>(null)
                const { scrollXProgress } = useScroll({ 
                  container: containerRef, 
                  target: itemRef,
                  offset: ["start end", "end start"]
                })
                const pointScale = useTransform(scrollXProgress, [0, 0.5, 1], [0.9, 1.1, 0.9])
                const isActive = activeIndex === i

                return (
                  <motion.div
                    key={i}
                    ref={itemRef}
                    className="flex flex-col items-center w-64 relative h-full"
                    onHoverStart={() => setActiveIndex(i)}
                    onHoverEnd={() => setActiveIndex(null)}
                  >
                    {/* Tarjetas superiores */}
                    {i % 2 === 0 && (
                      <motion.div
                        className="absolute bottom-[calc(50%+16px)] w-full origin-bottom"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.9,
                          y: isActive ? 0 : 10
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <TimelineCard event={event} isActive={isActive} />
                      </motion.div>
                    )}

                    {/* Punto central */}
                    <motion.div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                      style={{ scale: pointScale }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Circle className="w-5 h-5 text-primary fill-current drop-shadow-sm" />
                    </motion.div>

                    {/* Tarjetas inferiores */}
                    {i % 2 !== 0 && (
                      <motion.div
                        className="absolute top-[calc(50%+16px)] w-full origin-top"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.9,
                          y: isActive ? 0 : -10
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <TimelineCard event={event} isActive={isActive} />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// Componente de tarjeta con nuevos colores
function TimelineCard({ event, isActive }: { event: TimelineEvent, isActive: boolean }) {
  return (
    <div className="relative bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-lg rounded-xl overflow-hidden p-4 flex flex-col h-[350px] w-[240px] border-l-4 border-primary hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col gap-1 mb-3">
        <span className="text-md font-bold text-primary leading-tight">
          {event.year}
        </span>
        <h3 className="font-playfair text-lg font-bold line-clamp-2 leading-tight">
          {event.title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-4 flex-grow">
        {event.description}
      </p>
      {event.image && (
        <div className="relative aspect-[4/3] rounded-md overflow-hidden mt-auto">
          <Image
            src={event.image.src}
            alt={event.image.alt}
            fill
            className="object-cover"
            sizes="240px"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity",
              isActive ? "opacity-60" : "opacity-40"
            )}
          />
        </div>
      )}
    </div>
  )
}