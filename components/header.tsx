"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

type NavItem = {
  label: string
  href: string
  sectionId?: string
  children?: {
    label: string
    href: string
    sectionId?: string
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

  const handleNavClick = (e: React.MouseEvent, sectionId?: string, action?: () => void, href?: string) => {
    // Cierra el dropdown
    setActiveDropdown(null);
  
    if (href) {
      // Si hay un href, se redirige (sin interferir con scrollToSection)
      e.preventDefault();
      router.push(href);  // Usando Next.js router para navegación
      return;
    }
  
    // Si hay una sección, se hace scroll
    if (sectionId) {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  
    // Ejecuta acción si es que hay una
    if (action) {
      e.preventDefault();
      action();
    }
  }
  
  // Variantes de animación para los elementos del menú
  const menuItemVariants = {
    initial: { opacity: 0, y: -5, transition: { duration: 0.2 } },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.2 } },
  }
  

  // Variantes para el dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  // Variantes para los elementos del dropdown
  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.3,
      },
    }),
  }

  // Crear navItems con la opción de autoridades
  const navItems: NavItem[] = [
    { label: "Inicio", href: "/", sectionId: "inicio" },
    { label: "Carreras", href: "#", sectionId: "carreras", children: [
        {
          label: "Analista de Sistemas de Computación",
          href: "/sistemas",
          description: "Desarrollo de software y sistemas de información",
        },
        {
          label: "Tecnicatura en Redes",
          href: "/redes",
          description: "Infraestructura y comunicaciones",
        },
        {
          label: "Tecnicatura en Seguridad e Higiene",
          href: "/seguridad",
          description: "Prevención de riesgos laborales",
        }
      ]
    },
{
  label: "Institucional",
  href: "#",
  sectionId: undefined,
  children: [
    {
      label: "Historia",
      href: "#historia-horizontal",
      sectionId: "historia-horizontal",
    },
  ],
},

  ]

  return (
    <motion.header
    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-zinc-900/90 py-2 shadow-md backdrop-blur-sm dark:bg-zinc-900/90" : "bg-transparent py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container flex items-center justify-between px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Instituto Superior de Informática Logo"
                width={60}
                height={60}
                className="h-14 w-auto"
              />
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white leading-tight">Instituto Superior de Informática</h1>
                <p className="text-xs text-white/80">Puerto Piray, Misiones, Argentina</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <nav className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={menuItemVariants}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                className={`flex items-center font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-white dark:text-white" : "text-white"
                } ${activeDropdown === item.label ? "text-primary" : ""} cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item.label}
                {item.children && (
                  <motion.span
                    animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.span>
                )}
              </motion.a>

              {item.children && (
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute left-0 top-full mt-2 min-w-[220px] rounded-md bg-white p-2 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700"
                      onMouseEnter={() => {
                        if (dropdownTimeoutRef.current) {
                          clearTimeout(dropdownTimeoutRef.current)
                        }
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="space-y-1 py-1">
                        {item.children.map((child, childIndex) => (
                          <motion.a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.sectionId, child.action)}
                            className="block rounded-md px-3 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-primary dark:text-white dark:hover:bg-zinc-700 dark:hover:text-primary cursor-pointer"
                            variants={dropdownItemVariants}
                            custom={childIndex}
                            whileHover={{
                              backgroundColor: "rgba(123, 63, 97, 0.1)",
                              x: 5,
                              transition: { duration: 0.2 },
                            }}
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              className={`bg-primary text-white hover:bg-primary/90 ${isScrolled ? "border-primary" : "border-white"}`}
              onClick={(e) => handleNavClick(e, "inscripciones")}
            >
              Contacto
            </Button>
          </motion.div>
        </nav>

        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? "text-white" : "text-white"}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
              <div className="flex flex-col space-y-6 pt-6">
                {navItems.map((item) => (
                  <div key={item.label} className="space-y-3">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.sectionId)}
                      className="text-lg font-medium transition-colors hover:text-primary cursor-pointer"
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="ml-4 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-700">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.sectionId, child.action)}
                            className="block text-sm text-zinc-600 transition-colors hover:text-primary dark:text-zinc-300 dark:hover:text-primary cursor-pointer"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={(e) => handleNavClick(e, "inscripciones")}
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
