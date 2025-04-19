"use client"

import type React from "react"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

export function Footer() {
  const { scrollToSection } = useSmoothScroll()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <footer className="bg-white text-zinc-800 border-t border-zinc-200 dark:bg-zinc-950 dark:text-white dark:border-zinc-800">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 font-playfair text-xl font-bold">ISIPP 1206</h3>
            <p className="mb-4 text-muted-foreground">
              Formando profesionales con excelencia académica y compromiso social desde hace más de 30 años.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-playfair text-xl font-bold">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#inicio"
                  onClick={(e) => handleLinkClick(e, "inicio")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/#carreras"
                  onClick={(e) => handleLinkClick(e, "carreras")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Carreras
                </a>
              </li>
              <li>
                <a
                  href="/#inscripciones"
                  onClick={(e) => handleLinkClick(e, "inscripciones")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Inscripciones
                </a>
              </li>
              <li>
                <a
                  href="/#institucional"
                  onClick={(e) => handleLinkClick(e, "institucional")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Institucional
                </a>
              </li>
              <li>
                <a
                  href="/#contacto"
                  onClick={(e) => handleLinkClick(e, "contacto")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-playfair text-xl font-bold">Carreras</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#sistemas"
                  onClick={(e) => handleLinkClick(e, "sistemas")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Tec. Análisis de Sistemas
                </a>
              </li>
              <li>
                <a
                  href="/#redes"
                  onClick={(e) => handleLinkClick(e, "redes")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Tec. Redes
                </a>
              </li>
              <li>
                <a
                  href="/#seguridad"
                  onClick={(e) => handleLinkClick(e, "seguridad")}
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline cursor-pointer"
                >
                  Tec. Seguridad e Higiene Laboral
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-playfair text-xl font-bold">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Calle sarmiento, Puerto Piray, Misiones, Argentina</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">+54 11 4567-8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">info@isipp1206.edu.ar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Instituto Superior ISIPP 1206. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
