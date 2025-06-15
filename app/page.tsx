"use client"
import DonationSection from "@/components/sections/donations/DonationSection";
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapSection } from "@/components/map-section"
import { FlipCard } from "@/components/flip-card"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import SocialBubble from '@/components/SocialBubble'; // Ajusta la ruta si es necesario
import {FormulariosInscripcion} from "@/components/sections/ExamnSection/ExamEnrollmentSection";

import { Chatbot } from '@/components/chatbot/chatbot';
import { MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollToSection } = useSmoothScroll()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Estado para rastrear la sección activa
  const [activeSection, setActiveSection] = useState<string>("inicio")

  // Efecto parallax para la imagen de fondo
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Observador de intersección para detectar secciones visibles
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            // Actualizar la URL sin causar un scroll
            const url = new URL(window.location.href)
            url.hash = entry.target.id
            window.history.replaceState({}, "", url.toString())
          }
        })
      },
      { threshold: 0.3 }, // El umbral determina qué porcentaje del elemento debe ser visible
    )

    // Observar todas las secciones
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  // Variantes de animación para las secciones
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  // Variantes para elementos que aparecen en secuencia
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Variantes para imágenes
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <SocialBubble />
      <motion.div key="main-content" initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
{/* Hero Section - Versión Reorganizada */}
<section id="inicio" ref={heroRef} className="relative h-screen w-full overflow-hidden">
  {/* Video de fondo */}
  <motion.div 
    className="absolute inset-0 z-0 flex items-center justify-center bg-black"
    style={{ y, scale }}
  >
    <video
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      className="h-auto w-auto min-h-full min-w-full object-cover"
      poster="/fallback-hero.png"
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
      Tu navegador no soporta el video.
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
  </motion.div>

  {/* Contenido */}
  <motion.div className="relative z-10 h-full flex flex-col justify-between" style={{ opacity }}>
    
    {/* Parte superior: título y subtítulo */}
    <div className="pt-40 text-center">
      <motion.h1
        className="font-playfair text-4xl font-bold text-white sm:text-5xl md:text-6xl glow-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ISIPP 1206
      </motion.h1>

      <motion.p
        className="mt-2 font-playfair text-xl text-white md:text-2xl lg:text-3xl px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Tradición, Conocimiento y Futuro
      </motion.p>
    </div>

    {/* Parte inferior: botón */}
    <div className="mb-24 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent w-[200%]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <Button
            className="relative h-12 px-8 text-lg font-semibold text-white bg-transparent hover:bg-transparent"
            onClick={() => scrollToSection("carreras")}
            aria-label="Conocé nuestras carreras"
          >
            <span className="glow-text">Conocé nuestras carreras</span>
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </div>

    {/* Flecha scroll */}
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <ChevronDown className="h-8 w-8 animate-bounce text-white/80" />
    </motion.div>
  </motion.div>
</section>

        <motion.section
          id="carreras"
          className="section-gradient-2 py-24 dark:bg-zinc-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <motion.div className="mb-16 text-center" variants={itemVariants}>
              <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-primary">
                Nuestras Carreras
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Formación académica de excelencia para los profesionales del mañana
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {careers.map((career, index) => (
                <FlipCard key={career.title} career={career} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
<motion.section
  id="formularios"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  <FormulariosInscripcion />
</motion.section>

<motion.section
  id="contacto"
  className="relative py-28 bg-zinc-50 dark:bg-zinc-900 from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={sectionVariants}
>
  <div className="container px-4 md:px-6 relative z-10">
    {/* Encabezado */}
    <motion.div 
      className="mx-auto max-w-2xl text-center mb-16"
      variants={itemVariants}
    >
      <div className="inline-flex items-center justify-center mb-4">
        <div className="w-8 h-0.5 bg-primary mr-3"></div>
        <span className="text-sm font-medium tracking-wider text-primary uppercase">
          Contacto
        </span>
        <div className="w-8 h-0.5 bg-primary ml-3"></div>
      </div>
      <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl text-gray-900 dark:text-white">
        Estamos aquí para ayudarte
      </h2>
      <p className="mt-4 text-lg text-muted-foreground dark:text-gray-300">
        Completá el formulario o visitanos en nuestro instituto
      </p>
    </motion.div>

    {/* Formulario y Mapa */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Formulario */}
      <motion.div
        className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ContactForm />
      </motion.div>

      {/* Mapa */}
      <motion.div
        className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none"></div>
        
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1501.6705839486633!2d-54.713887003227875!3d-26.46879089974918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f776cc76399bb3%3A0xc081815410428ef3!2sInstituto%20Superior%20de%20Inform%C3%A1tica%20Cod.1206!5e0!3m2!1ses-419!2sar!4v1749856000154!5m2!1ses-419!2sar"
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          aria-hidden="false"
          tabIndex={0}
        ></iframe>

        <a
          href="https://www.google.com/maps/place/ISIPP+1206"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 z-20 inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-800 text-primary dark:text-white rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Abrir en Maps</span>
        </a>
      </motion.div>
    </div>

    {/* Información de contacto */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Dirección */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <MapPin className="w-5 h-5 text-primary dark:text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
          <p className="text-gray-900 dark:text-white">Calle Juan Manuel de Rosas, Puerto Piray, Misiones, Argentina</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <Mail className="w-5 h-5 text-primary dark:text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <a href="mailto:info@isipp1206.edu.ar" className="text-gray-900 dark:text-white hover:underline">
            info@isipp1206.edu.ar
          </a>
        </div>
      </div>

      {/* Teléfono */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <Phone className="w-5 h-5 text-primary dark:text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
          <a href="tel:+543751444222" className="text-gray-900 dark:text-white hover:underline">
            +54 3751 444222
          </a>
        </div>
      </div>

      {/* Horario */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-primary dark:text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Horario</p>
          <p className="text-gray-900 dark:text-white">Lun-Vie: 8-20hs</p>
          <p className="text-gray-900 dark:text-white">Sáb: 9-13hs</p>
        </div>
      </div>
    </motion.div>
  </div>
</motion.section>

        {/* CTA Section */}
        <motion.section
          className="bg-primary py-24 text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="font-playfair text-3xl font-bold tracking-tight md:text-4xl glow-text"
              >
                Tu futuro empieza hoy. Inscribite y marcá la diferencia.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="hover-vibrate"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 glow-border"
                    onClick={() => scrollToSection("contacto")}
                  >
                    Contacto
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

    




        <Footer />
      </motion.div>
    </div>
  )
}

const careers = [
  {
    title: "Analista de Sistemas de Computación",
    description:
      "Estudiar para analista de sistemas en computación te brinda una formación integral en desarrollo de software, bases de datos, redes y sistemas de información para liderar proyectos tecnológicos.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-code"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    details: [
      "Duración: 3 años",
      "Título oficial con validez nacional",
      "Programación en múltiples lenguajes",
      "Diseño y administración de bases de datos",
      "Análisis y diseño de sistemas",
      "Gestión de proyectos informáticos",
      "Prácticas profesionales en empresas del sector",
    ],
    sectionId: "sistemas",
  },
  {
    title: "Tec. Redes",
    description:
      "Especialización en diseño, implementación y mantenimiento de infraestructuras de redes y sistemas de comunicación empresarial.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-network"
      >
        <rect x="16" y="16" width="6" height="6" rx="1"></rect>
        <rect x="2" y="16" width="6" height="6" rx="1"></rect>
        <rect x="9" y="2" width="6" height="6" rx="1"></rect>
        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path>
        <path d="M12 12V8"></path>
      </svg>
    ),
    details: [
      "Duración: 3 años",
      "Título oficial con validez nacional",
      "Configuración de redes LAN, WAN y WLAN",
      "Administración de servidores",
      "Seguridad informática y ciberseguridad",
      "Virtualización y cloud computing",
      "Certificaciones internacionales disponibles",
    ],
    sectionId: "redes",
  },
  {
    title: "Tec. Seguridad e Higiene Laboral",
    description:
      "Formación especializada en prevención de riesgos laborales, normativas de seguridad y gestión de entornos de trabajo saludables.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-shield-check"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
    details: [
      "Duración: 3 años",
      "Título oficial con validez nacional",
      "Normativas nacionales e internacionales",
      "Evaluación y prevención de riesgos laborales",
      "Gestión ambiental y sustentabilidad",
      "Ergonomía y factores humanos",
      "Prácticas profesionales en empresas",
    ],
    sectionId: "seguridad",
  },
]
