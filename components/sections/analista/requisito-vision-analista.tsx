"use client";
import React from "react";
import InfoCard from "@/components/InfoCardTemp";

interface SistemasExtraInfoSectionProps {
  className?: string;
}

export default function SistemasExtraInfoSection({ className }: SistemasExtraInfoSectionProps) {
  return (
    <section className={`py-16 bg-background text-foreground ${className || ""}`}>
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        <InfoCard
          title="Requisitos"
          icon="📋"
          items={[
            "✔ Educación Secundaria completa",
            "✔ Conocimientos básicos de informática",
            "✔ Capacidad de resolución de problemas lógicos",
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="¿Cómo vas a cursar?"
          icon="📚"
          items={[
            "📌 <strong>Modalidad presencial</strong> con prácticas en laboratorio",
            "📌 <strong>Material didáctico actualizado</strong>",
            "📌 <strong>Acompañamiento docente personalizado</strong>",
          ]}
          className="bg-card text-card-foreground"
        >
          💻 Aprendé programación y desarrollo de sistemas.
        </InfoCard>

        <InfoCard
          title="¿Por qué elegir esta carrera?"
          icon="🎯"
          items={[
            "📈 <strong>Alta demanda laboral:</strong> uno de los perfiles más buscados en el mercado IT",
            "💼 <strong>Versatilidad:</strong> podés trabajar en cualquier sector económico",
            "🌐 <strong>Oportunidades globales:</strong> posibilidad de trabajo remoto internacional"
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Funciones Clave"
          icon="🌟"
          items={[
            "💻 Desarrollo de software y aplicaciones",
            "🛠️ Análisis y diseño de sistemas informáticos",
            "🔍 Testing y calidad de software",
            "📊 Gestión de bases de datos",
            "🤖 Automatización de procesos",
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Ámbitos de Trabajo"
          icon="🏢"
          className="bg-card text-card-foreground"
        >
          <p className="text-lg text-muted-foreground">
            Podés desempeñarte en empresas de desarrollo de software, departamentos de sistemas, consultoras IT, 
            bancos, empresas de telecomunicaciones, startups tecnológicas o como freelancer.
          </p>
        </InfoCard>

      </div>
    </section>
  );
}