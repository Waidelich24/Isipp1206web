"use client";
import React from "react";
import InfoCard from "@/components/InfoCardTemp";

interface RedesExtraInfoSectionProps {
  className?: string;
}

export default function RedesExtraInfoSection({ className }: RedesExtraInfoSectionProps) {
  return (
    <section className={`py-16 bg-background text-foreground ${className || ""}`}>
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        <InfoCard
          title="Requisitos"
          icon="📋"
          items={[
            "✔ Educación Secundaria completa",
            "✔ Manejo básico de computadoras y conectividad a internet",
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="¿Cómo vas a cursar?"
          icon="📚"
          items={[
            "📌 <strong>Modalidad presencial</strong> ",
            "📌 <strong>Material didáctico</strong> ",
            "📌 <strong>Acompañamiento docente</strong> ",
          ]}
          className="bg-card text-card-foreground"
        >
          💻 Aprendé con apoyo constante.
        </InfoCard>

        <InfoCard
          title="¿Por qué elegir esta carrera?"
          icon="🎯"
          items={[
            "📈 <strong>Alta demanda laboral:</strong> el sector tecnológico está en auge",
            "✅ <strong>Competencia profesional:</strong> conocimientos aplicables"
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Funciones Clave"
          icon="🌟"
          items={[
            "🛠 Configuración de redes y dispositivos",
            "🔐 Seguridad informática y protocolos",
            "📡 Soporte técnico y resolución de problemas",
            "🧰 Mantenimiento de infraestructura digital",
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Ámbitos de Trabajo"
          icon="🏢"
          className="bg-card text-card-foreground"
        >
          <p className="text-lg text-muted-foreground">
            Podés desempeñarte en empresas de telecomunicaciones, áreas de IT, instituciones educativas,
            organismos públicos o como técnico independiente.
          </p>
        </InfoCard>

      </div>
    </section>
  );
}