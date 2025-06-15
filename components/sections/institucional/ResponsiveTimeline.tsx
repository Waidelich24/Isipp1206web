"use client"

import { useState, useEffect } from 'react'
import { HorizontalTimeline } from './TimelineGallery'
import { VerticalTimeline } from './TimelineGalleryMovil'

interface TimelineEvent {
  year: string
  title: string
  description: string
  image?: {
    src: string
    alt: string
  }
}

interface ResponsiveTimelineProps {
  events: TimelineEvent[]
  id?: string
  className?: string
}

export function ResponsiveTimeline({ events, id, className }: ResponsiveTimelineProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Cambia a 768px o el breakpoint que prefieras
    }
    
    // Verificar al cargar
    checkMobile()
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile ? (
    <VerticalTimeline events={events} id={id} className={className} />
  ) : (
    <HorizontalTimeline events={events} id={id} className={className} />
    
  )
}