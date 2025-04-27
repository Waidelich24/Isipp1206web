"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Importaciones corregidas
import { Header } from "@/components/header";
import SocialBubble from "@/components/SocialBubble";
import AnalistaInfoSection from "@/components/sections/analista/AnalistaInfoSection";
import AnalistaRequisitosVision from "@/components/sections/analista/requisito-vision-analista";
import AnalistaScheduleFragment from "@/components/sections/analista/AnalistaScheduleFragment";
import CorrelativasVisual from "@/components/CorrelativasVisual";
import { Footer } from "@/components/footer";


export default function AnalistaPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <motion.div
      key="main-content"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-background text-foreground font-inter"
    >
      {/* Sección Hero */}
      <section
        id="inicio"
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0 glow-border"
          style={{ y, scale }}
        >
          <Image
            src="/analista_hero_section.jpeg"
            alt="Analista de Sistemas"
            fill
            priority
            quality={100}
            className="object-cover object-[50%_30%] card-content-transition"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <Header />
          <SocialBubble />
          <h1 className="text-5xl font-bold text-center font-playfair glow-text-tight animate-pulse-intense">
            Analista en Sistemas y Computación
          </h1>
        </div>
      </section>

      {/* Secciones siguientes - Verifica que cada uno de estos componentes exista y se exporte correctamente */}
      <AnalistaInfoSection className="section-gradient-1" />
      <AnalistaRequisitosVision className="section-gradient-2 dark:bg-card" />
      <AnalistaScheduleFragment className="bg-background dark:bg-popover" />
      <CorrelativasVisual 
        carreraId="sistemas" 
        className="perspective-1000" 
      />
      <Footer />
    </motion.div>
  );
}