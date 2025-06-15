"use client";

import React from "react";
import { FORM_LINKS } from "./forms";
import { FilePenLine, CalendarCheck2 } from "lucide-react";
import { motion } from "framer-motion";

export const FormulariosInscripcion = () => {
  return (
    <section className="w-full py-28 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">

      {/* Elementos decorativos */}

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Encabezado */}
        <div className="inline-flex items-center justify-center mb-4">
          <div className="w-8 h-0.5 bg-primary mr-3" />
          <span className="text-sm font-medium tracking-wider text-primary uppercase">
            Inscripciones
          </span>
          <div className="w-8 h-0.5 bg-primary ml-3" />
        </div>

        <motion.h2
          className="font-playfair text-4xl font-bold tracking-tight md:text-5xl text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Inscripción a <span className="text-primary">Finales y Cuatrimestres</span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Selecciona el formulario correspondiente para realizar tu inscripción.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Formulario Exámenes */}
          <motion.a
            href={FORM_LINKS.examenes}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-[hsl(var(--background))] text-foreground shadow-md hover:shadow-xl hover:shadow-primary/20 p-8 rounded-2xl border border-transparent transition-all duration-300 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-primary/10 text-primary dark:bg-primary/20 p-4 rounded-full mb-4">
              <FilePenLine className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mt-2">Exámenes Finales</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Inscribite a tus finales desde aquí
            </p>
            <div className="mt-4 text-sm text-primary font-medium flex items-center">
              Acceder al formulario
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </motion.a>

          {/* Formulario Cuatrimestres */}
          <motion.a
            href={FORM_LINKS.cuatrimestre}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-[hsl(var(--background))] text-foreground shadow-md hover:shadow-xl hover:shadow-primary/20 p-8 rounded-2xl border border-transparent transition-all duration-300 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-primary/10 text-primary dark:bg-primary/20 p-4 rounded-full mb-4">
              <CalendarCheck2 className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mt-2">Inscripción al Cuatrimestre</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Accedé al formulario de inscripción al primer cuatrimestre
            </p>
            <div className="mt-4 text-sm text-primary font-medium flex items-center">
              Acceder al formulario
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

