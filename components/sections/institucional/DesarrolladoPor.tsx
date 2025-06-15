import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function DesarrolladoPor() {
  const developers = [
    {
      name: "Angel Agustin Waidelich",
      role: "Full-stack Developer",
      bio: "Apasionado por construir soluciones web eficientes y elegantes. Para saber mas contactame",
      email: "waidelich24@gmail.com",
      github: "Waidelich24",
      linkedin: "angel-waidelich-579270326",
      portfolio: "https://angel-waidelich-portafolio.vercel.app",
      icon: "/icons desarrolladores/Perfilimage-Angel-Waidelich.png"
    },
    {
      name: "Agustín Gabriel Torres",
      role: "Full-stack Developer",
      bio: "Estudiante dedicado con pasión por el desarrollo open-source y el aprendizaje constante.",
      email: "agustinpiraywa@gmail.com",
      github: "https://github.com/Gabrieltorres28",
      linkedin: "https://www.linkedin.com/in/gabriel-torres-4b652a284/",
      portfolio: ""
    }
  ]

  return (
    <section className="relative py-28 bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      {/* Elementos decorativos (opcionales, más sutiles) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-8 h-0.5 bg-primary mr-3"></div>
            <span className="text-sm font-medium tracking-wider text-primary uppercase">
              Desarrollado por
            </span>
            <div className="w-8 h-0.5 bg-primary ml-3"></div>
          </div>
          <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl text-gray-900 dark:text-white">
            Nuestros <span className="text-primary dark:text-primary-400">Talentos</span>
          </h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Este sitio fue creado por estudiantes de 3er año como proyecto académico, aplicando las últimas tecnologías web.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-8">
                <div className="flex items-start mb-6">
                  <div className="relative w-16 h-16 rounded-lg bg-primary/10 dark:bg-primary/20 overflow-hidden flex-shrink-0">
                    {dev.icon ? (
                      <Image
                        src={dev.icon}
                        alt={`${dev.name} icon`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-bold text-primary dark:text-primary-400">
                          {dev.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{dev.name}</h3>
                    <p className="text-primary dark:text-primary-400">{dev.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic border-l-4 border-primary pl-4 py-1">
                  {dev.bio}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <Link 
                      href={`mailto:${dev.email}`} 
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors break-all"
                    >
                      {dev.email}
                    </Link>
                  </div>
                  
                  <div className="flex space-x-4 pt-2">
                    <Link 
                      href={`https://github.com/${dev.github}`} 
                      target="_blank" 
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    >
                      <FaGithub className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={`https://linkedin.com/in/${dev.linkedin}`} 
                      target="_blank" 
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={dev.portfolio} 
                      target="_blank" 
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
                    >
                      <FaGlobe className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
              
<div className="bg-gray-50 dark:bg-zinc-700 px-6 py-4">
  {dev.portfolio ? (
    <Link 
      href={dev.portfolio} 
      target="_blank" 
      className="inline-flex items-center text-gray-700 font-medium text-primary dark:text-primary-200 hover:underline"
    >
      Ver portafolio completo
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </Link>
  ) : (
    <span className="text-gray-500 dark:text-gray-400 italic">
      No disponible por el momento
    </span>
  )}
</div>

            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Proyecto académico desarrollado durante el ciclo lectivo 2025
          </p>
        </motion.div>
      </div>
    </section>
  )
}