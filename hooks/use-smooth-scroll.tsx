"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useSmoothScroll() {
  const router = useRouter()

  const scrollToSection = useCallback(
    (sectionId: string) => {
      // Actualizar la URL con el fragmento
      router.push(`/#${sectionId}`, { scroll: false })

      // Encontrar el elemento y hacer scroll suave
      const element = document.getElementById(sectionId)
      if (element) {
        // Offset para compensar el header fijo
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        // Animación de scroll suave con easing
        const start = window.pageYOffset
        const target = offsetPosition
        const distance = target - start
        const startTime = performance.now()
        const duration = 800 // ms

        function easeOutCubic(t: number): number {
          return 1 - Math.pow(1 - t, 3)
        }

        function step(currentTime: number) {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = easeOutCubic(progress)

          window.scrollTo(0, start + distance * easeProgress)

          if (progress < 1) {
            window.requestAnimationFrame(step)
          }
        }

        window.requestAnimationFrame(step)
      }
    },
    [router],
  )

  return { scrollToSection }
}
