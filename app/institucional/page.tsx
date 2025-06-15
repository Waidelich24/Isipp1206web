"use client";

import VisionYMision from "@/components/sections/institucional/VisionYMision";
import DesarrolladoPor from "@/components/sections/institucional/DesarrolladoPor";
import { ResponsiveTimeline } from '@/components/sections/institucional/ResponsiveTimeline';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import SocialBubble from '@/components/SocialBubble';

const timelineEvents = [
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
];

export default function InstitucionalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      {/* Header con navegación */}
      <Header />
      
      {/* Botones flotantes de redes sociales */}
      <SocialBubble />
      
      {/* Contenido principal con secciones navegables */}
      <main className="flex-grow w-full">
        {/* Sección Hero - Punto de anclaje "inicio" */}
        <section 
          id="inicio" 
          className="w-full bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 py-24 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Conoce Nuestra Institución
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Más de 30 años formando profesionales en Puerto Piray con excelencia académica y enfoque innovador.
            </p>
          </div>
        </section>
        
        {/* Sección Visión y Misión - Punto de anclaje "mision-vision" */}
        <section 
          id="mision-vision" 
          className="scroll-mt-20"
        >
          <VisionYMision />
        </section>
        
        {/* Sección Historia - Timeline - Punto de anclaje "historia" */}
        <section 
          id="historia" 
          className="w-full py-16 bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Nuestra Historia
            </h2>
            <ResponsiveTimeline 
              id="historia-horizontal"
              events={timelineEvents}
              className="w-full"
            />
          </div>
        </section>
      </main>
      
      {/* Sección Desarrollado por - Punto de anclaje "desarrollado-por" */}
      <section 
        id="desarrollado-por" 
        className="scroll-mt-20"
      >
        <DesarrolladoPor />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}