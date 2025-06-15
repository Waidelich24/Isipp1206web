"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const dataAlumnos = [
  { year: 2022, alumnos: 60 },
  { year: 2023, alumnos: 85 },
  { year: 2024, alumnos: 120 },
  { year: 2025, alumnos: 180 },
  { year: 2026, alumnos: 200 },
  { year: 2027, alumnos: 220 },
];

export default function VisionYMision() {
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4 font-playfair tracking-tight">
            Nuestro <span className="text-primary dark:text-primary-400">Compromiso</span>
          </h2>
          <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent dark:via-primary-400 mx-auto rounded-full"></div>
          <p className="mt-3 lg:mt-4 text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Único instituto terciario en Puerto Piray formando profesionales para las demandas tecnológicas actuales
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Tarjeta de Misión - Versión para ambos dispositivos */}
          <div className={`${!isMobile ? "perspective-1000 h-full" : ""}`}>
            {!isMobile ? (
              // Versión Desktop con efecto flip
              <div className={`flip-card-inner ${flipped ? "rotate-y-180" : ""}`}>
                <div className="flip-card-front bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md border-l-4 border-primary flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-primary dark:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Misión</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-grow">
                    Ser el referente educativo en Puerto Piray, ofreciendo carreras únicas con enfoque en las tecnologías más demandadas.
                  </p>
                  <button
                    onClick={() => setFlipped(true)}
                    className="mt-6 px-4 py-2 border border-primary text-primary dark:text-gray-300 rounded-lg font-medium hover:bg-primary hover:text-white transition duration-300 flex items-center justify-center w-max"
                  >
                    Conocer nuestro impacto
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flip-card-back bg-primary dark:bg-primary/90 p-8 rounded-2xl shadow-md flex flex-col justify-center relative text-white h-full">
                  <button
                    onClick={() => setFlipped(false)}
                    className="absolute top-6 right-6 text-white hover:text-primary-200 transition-colors"
                    aria-label="Volver"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h3 className="text-2xl font-bold mb-6">Nuestro Impacto</h3>
                  <ul className="space-y-4 text-primary-50">
                    {[
                      "Único instituto terciario en la región de Puerto Piray",
                      "Egresados trabajando en empresas locales y el extranjero",
                      "Carreras diseñadas según las últimas tendencias tecnológicas",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="bg-white/20 p-1 rounded-full mr-3 mt-0.5">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-base md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Versión Móvil con acordeón animado
              <motion.div 
                className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md border-l-4 border-primary"
                initial={false}
                animate={{ height: flipped ? 'auto' : 'auto' }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary dark:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Misión</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  Ser el referente educativo en Puerto Piray, ofreciendo carreras únicas con enfoque en las tecnologías más demandadas.
                </p>
                
                <button
                  onClick={() => setFlipped(!flipped)}
                  className="mt-4 flex items-center text-primary dark:text-primary-300 text-sm font-medium"
                >
                  {flipped ? 'Ocultar impacto' : 'Ver nuestro impacto'}
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform ${flipped ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {flipped && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pl-2 border-l-2 border-primary/30">
                        <ul className="space-y-3 text-primary-800 dark:text-primary-200">
                          {[
                            "Único instituto terciario en la región",
                            "Egresados trabajando en empresas locales e internacionales",
                            "Carreras con las últimas tendencias tecnológicas",
                          ].map((item, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className="bg-primary/20 p-0.5 rounded-full mr-2 mt-0.5">
                                <svg
                                  className="h-4 w-4 text-primary dark:text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Tarjeta de Visión */}
          <div className="bg-white dark:bg-zinc-800 p-6 lg:p-8 rounded-2xl shadow-md border-l-4 border-primary relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 blur-xl"></div>

            <div className="flex items-center mb-4 lg:mb-6">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 lg:p-3 rounded-xl mr-3 lg:mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 lg:h-8 w-6 lg:w-8 text-primary dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Visión</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base lg:text-lg mb-4 lg:mb-6 leading-relaxed">
              Expandir nuestra oferta educativa con nuevas carreras innovadoras, consolidándonos como el centro de formación técnica más importante de la región.
            </p>

            {/* Gráfico */}
            <div className="pt-4 lg:pt-6 border-t border-gray-200 dark:border-zinc-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 lg:mb-4">
                <h4 className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                  Evolución de la matrícula
                </h4>
                <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">2022 - 2027</span>
              </div>

              <div className="h-[180px] lg:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dataAlumnos} 
                    margin={{ top: 10, right: 0, bottom: 5, left: -20 }}
                    barSize={isMobile ? 20 : 30}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode() ? "#444" : "#eee"} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: darkMode() ? "#ccc" : "#666", fontSize: isMobile ? 10 : 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: darkMode() ? "#ccc" : "#666", fontSize: isMobile ? 10 : 12 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 250]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode() ? "#222" : "#fff",
                        borderRadius: 6,
                        borderColor: "transparent",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        fontSize: isMobile ? 12 : 14
                      }}
                      itemStyle={{ color: darkMode() ? "#fff" : "#000" }}
                    />
                    <Bar
                      dataKey="alumnos"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );

  // Helper to detect dark mode
  function darkMode() {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }
}