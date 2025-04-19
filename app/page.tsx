"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapSection } from "@/components/map-section"
import { FlipCard } from "@/components/flip-card"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import SocialBubble from '@/components/SocialBubble'; // Ajusta la ruta si es necesario
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
        {/* Hero Section */}
        <section id="inicio" ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
            <Image
              src="/fondoisipp.png"
              alt="ISIPP Building"
              fill
              className="object-cover object-center"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 mix-blend-multiply" />
          </motion.div>

          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
            style={{ opacity }}
          >
            <motion.h1
              className="font-playfair text-4xl font-bold tracking-tight text-white md:text-6xl glow-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ISIPP 1206
            </motion.h1>
            <motion.p
              className="mt-4 font-playfair text-xl text-white md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tradición, Conocimiento y Futuro
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <div className="relative overflow-hidden rounded-md group animate-pulse-intense">
                {/* Fondo animado con color primario */}
                <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm group-hover:bg-primary/40 transition-colors duration-300"></div>

                {/* Efecto de luz que se mueve con color primario */}
                <motion.div
                  className="absolute inset-0 w-[200%] h-full animate-shimmer-primary"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />

                {/* Borde brillante */}
                <div className="absolute inset-0 rounded-md glow-border"></div>

                {/* Botón real */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="hover-vibrate"
                >
                  <Button
                    className="relative bg-transparent hover:bg-transparent px-8 py-3 text-white border border-white/50 z-10 font-bold"
                    size="lg"
                    onClick={() => scrollToSection("carreras")}
                  >
                    <span className="relative z-10 text-white glow-text">Conocé nuestras carreras</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Careers Section */}
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

        {/* Detailed Career Sections */}
        <motion.section
          id="sistemas"
          className="section-gradient-1 py-24 dark:bg-zinc-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <motion.h2
                className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-center mb-12 text-primary"
                variants={itemVariants}
              >
                Analista de Sistemas de Computación
              </motion.h2>

              <motion.div className="grid gap-8 md:grid-cols-2 items-center" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold mb-4">Formación integral en desarrollo de software</h3>
                  <p className="text-muted-foreground mb-4">
                    Estudiar para analista de sistemas en computación te brinda una formación completa en el desarrollo
                    de software, bases de datos, redes y sistemas de información, preparándote para liderar proyectos
                    tecnológicos en empresas de cualquier tamaño.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Duración: 3 años</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Título oficial con validez nacional</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Prácticas profesionales en empresas del sector</span>
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      className="mt-6 bg-primary text-white hover:bg-primary/90 hover-vibrate"
                      onClick={() => scrollToSection("inscripciones")}
                    >
                      Contacto
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <Image
                    src="/informatica.png?height=800&width=600"
                    alt="Estudiantes de Análisis de Sistemas"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="redes"
          className="section-gradient-2 py-24 dark:bg-zinc-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <motion.h2
                className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-center mb-12 text-primary"
                variants={itemVariants}
              >
                Tecnicatura en Redes
              </motion.h2>

              <motion.div className="grid gap-8 md:grid-cols-2 items-center" variants={containerVariants}>
                <motion.div
                  className="order-2 md:order-1 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <Image
                    src="/pararede.webp?height=800&width=600"
                    alt="Estudiantes de Redes"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
                </motion.div>
                <motion.div className="order-1 md:order-2" variants={itemVariants}>
                  <h3 className="text-xl font-semibold mb-4">Especialización en infraestructuras de comunicación</h3>
                  <p className="text-muted-foreground mb-4">
                    La Tecnicatura en Redes te prepara para diseñar, implementar y mantener infraestructuras de redes y
                    sistemas de comunicación empresarial, con un enfoque práctico y orientado a las necesidades del
                    mercado.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Configuración de redes LAN, WAN y WLAN</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Administración de servidores</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Alcance internacional, certificaciones</span>
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      className="mt-6 bg-primary text-white hover:bg-primary/90 hover-vibrate"
                      onClick={() => scrollToSection("contacto")}
                    >
                      Contacto
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="seguridad"
          className="section-gradient-1 py-24 dark:bg-zinc-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <motion.h2
                className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-center mb-12 text-primary"
                variants={itemVariants}
              >
                Tecnicatura en Seguridad e Higiene Laboral
              </motion.h2>

              <motion.div className="grid gap-8 md:grid-cols-2 items-center" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold mb-4">Formación en prevención de riesgos laborales</h3>
                  <p className="text-muted-foreground mb-4">
                    La Tecnicatura en Seguridad e Higiene Laboral te brinda una formación especializada en prevención de
                    riesgos laborales, normativas de seguridad y gestión de entornos de trabajo saludables.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Normativas nacionales e internacionales</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Gestión ambiental y sustentabilidad</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Prácticas profesionales en empresas</span>
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      className="mt-6 bg-primary text-white hover:bg-primary/90 hover-vibrate"
                      onClick={() => scrollToSection("contacto")}
                    >
                      Contacto
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <Image
                    src="/tecseg.png?height=800&width=600"
                    alt="Estudiantes de Seguridad e Higiene"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Institutional Section */}
        <motion.section
          id="institucional"
          className="relative overflow-hidden section-gradient-2 py-24 dark:bg-zinc-950"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl text-primary">
                  Nuestra Institución
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Con más de 30 años de trayectoria, ISIPP 1206 se ha consolidado como una institución de referencia en
                  la formación de profesionales técnicos.
                </p>
                <div id="mision" className="mt-8 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-playfair text-xl font-semibold text-primary">Misión</h3>
                    <p className="mt-2 text-muted-foreground">
                      Formar profesionales técnicos con sólidos conocimientos, valores éticos y compromiso social,
                      capaces de responder a las demandas del mercado laboral actual.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-playfair text-xl font-semibold text-primary">Visión</h3>
                    <p className="mt-2 text-muted-foreground">
                      Ser reconocidos como una institución educativa de excelencia, referente en la formación técnica
                      profesional, que contribuye al desarrollo sostenible de la sociedad.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-[600px] overflow-hidden rounded-lg shadow-xl"
                whileHover={{ scale: 1.03 }}
              >
                <Image
                  src="/parawebinstituto.jpg?height=800&width=600"
                  alt="ISIPP Students"
                  fill
                  className="object-cover transition-transform duration-10000 ease-in-out hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
              </motion.div>
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
        <section id="ubicacion">
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
