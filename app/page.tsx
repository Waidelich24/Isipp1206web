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
import { ResponsiveTimeline } from '@/components/sections/timegalery/ResponsiveTimeline'
import { Chatbot } from '@/components/chatbot/chatbot';
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




        {/* Registration Form Section */}
        <motion.section
          id="inscripciones"
          className="section-gradient-1 py-24 dark:bg-zinc-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
              <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-primary">
                Consultá tu duda
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Completá el formulario para recibir más información sobre nuestras carreras
              </p>
            </motion.div>

            <div className="mx-auto mt-12 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Map Section */}
        <section id="contacto">
          <MapSection />
        </section>

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
                    onClick={() => scrollToSection("inscripciones")}
                  >
                    Contacto
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

    

<ResponsiveTimeline
  id="historia-horizontal"
  events={[
    {
      year: "1988-1989",
      title: "Fundación del Instituto",
      description: "El Instituto tuvo sus inicios en 1988 de forma experimental y fue oficialmente reconocido en 1989 por el Consejo General de Educación (CGE) como una institución privada adscripta teniendo a José Luis Farruggia como el primer directivo.",
      image: {
        src: "/Isipp_imagenes/fundacion.jpg",
        alt: "Edificio original del instituto"
      }
    },
    {
      year: "1993",
      title: "Cambio de dependencia",
      description: "Pasó a depender del Servicio Provincial de Enseñanza Privada de Misiones (SPEPM), marcando un nuevo capítulo en nuestra administración.",
      image: {
        src: "/Isipp_imagenes/primeros_alumnos.jpg",
        alt: "Documento de cambio de dependencia"
      }
    },
    {
      year: "1997",
      title: "Ampliación de la carrera",
      description: "Se amplió la duración de la carrera principal a 3 años, permitiendo una formación más completa y especializada para nuestros estudiantes.",
      image: {
        src: "/Isipp_imagenes/alumnos_posando.jpg",
        alt: "Alumnos en aulas ampliadas"
      }
    },
    {
      year: "2013",
      title: "Nuevas carreras",
      description: "Incorporamos las carreras de Administración de Redes informáticas y Analista de Sistemas de Computación, expandiendo nuestra oferta educativa.",
      image: {
        src: "/Isipp_imagenes/isipp5.jpg",
        alt: "Inauguración de nuevas carreras"
      }
    },
    {
      year: "2024",
      title: "Expansión educativa",
      description: "Lanzamos la carrera de Seguridad e Higiene Laboral, respondiendo a las necesidades del mercado laboral actual.",
      image: {
        src: "/Isipp_imagenes/alumnos_higiene.jpeg",
        alt: "Nueva carrera de Seguridad e Higiene"
      }
    }
  ]}
/>


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
