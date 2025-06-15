"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

type NavItem = {
  label: string
  href: string
  sectionId?: string
  children?: {
    label: string
    href: string
    description?: string
    action?: () => void
  }[]
}

type HeaderProps = {}

export function Header({}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { scrollToSection } = useSmoothScroll()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleNavClick = (e: React.MouseEvent, href: string, sectionId?: string, action?: () => void) => {
    e.preventDefault()
    setActiveDropdown(null)
    
    if (action) {
      action()
      return
    }

    if (sectionId) {
      if (href === "#") {
        scrollToSection(sectionId)
      } else {
        router.push(`${href}#${sectionId}`)
      }
    } else {
      router.push(href)
    }
  }

  // Variantes de animación
  const menuItemVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.05 }
    })
  }

  const navItems: NavItem[] = [
    { 
      label: "Inicio", 
      href: "/", 
      sectionId: "inicio" 
    },
    { 
      label: "Carreras", 
      href: "#", 
      sectionId: "carreras", 
      children: [
        {
          label: "Analista de Sistemas",
          href: "/sistemas",
          description: "Desarrollo de software y sistemas"
        },
        {
          label: "Tecnicatura en Redes",
          href: "/redes",
          description: "Infraestructura y comunicaciones"
        },
        {
          label: "Seguridad e Higiene",
          href: "/seguridad",
          description: "Prevención de riesgos laborales"
        }
      ]
    },
    { 
      label: "Institucional", 
      href: "/institucional", 
      children: [
        {
          label: "Mision Y Vision",
          href: "/institucional#mision-vision",
          description: "Conocenos y a nuestros logros",
          action: () => scrollToSection("/institucional#mision-vision")
        },
        {
          label: "Historia",
          href: "/institucional#historia",
          description: "Nuestra trayectoria"
        },
        {
          label: "Desarrollado Por",
          href: "/institucional#desarrollado-por",
          description: "Conoce a los desarrolladores detras"
        }
      ]
    }
  ]

  return (
    <motion.header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-zinc-900/90 py-2 shadow-md backdrop-blur-sm" : "bg-transparent py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Instituto Superior de Informática Logo"
              width={60}
              height={60}
              className="h-14 w-auto"
            />
            <div className="ml-3">
              <h1 className="text-lg font-bold text-white leading-tight">Instituto Superior de Informática</h1>
              <p className="text-xs text-white/80">Puerto Piray, Misiones</p>
            </div>
          </Link>
        </motion.div>

        {/* Navegación desktop */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              variants={menuItemVariants}
              initial="initial"
              animate="animate"
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                className={`flex items-center font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-white" : "text-white"
                } ${activeDropdown === item.label ? "text-primary" : ""}`}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
                {item.children && (
                  <motion.span animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.span>
                )}
              </motion.a>

              {item.children && (
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute left-0 top-full mt-2 min-w-[220px] rounded-md bg-white p-2 shadow-lg dark:bg-zinc-800"
                      onMouseEnter={() => clearTimeout(dropdownTimeoutRef.current as NodeJS.Timeout)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="space-y-1 py-1">
                        {item.children.map((child, childIndex) => (
                          <motion.a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.href)}
                            className="block rounded-md px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700"
                            variants={dropdownItemVariants}
                            custom={childIndex}
                            whileHover={{ x: 5 }}
                          >
                            <div className="font-medium">{child.label}</div>
                            {child.description && (
                              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{child.description}</div>
                            )}
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
          
          <ThemeToggle />
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={(e) => handleNavClick(e, "/#contacto")}
            >
              Contacto
            </Button>
          </motion.div>
        </nav>

        {/* Navegación móvil */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[300px]"
              title="Menú principal"
              hideTitle={false}
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left text-xl font-bold">Menú</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                      className="block py-2 text-lg font-medium hover:text-primary"
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="ml-4 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-700">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.href)}
                            className="block py-1.5 text-sm text-zinc-600 hover:text-primary dark:text-zinc-300"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  className="mt-4 bg-primary text-white hover:bg-primary/90"
                  onClick={(e) => handleNavClick(e, "/#contacto")}
                >
                  Contacto
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}