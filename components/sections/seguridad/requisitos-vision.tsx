"use client";
import React from "react";
import InfoCard from "@/components/InfoCardTemp";

interface SeguridadRequisitosVisionProps {
  className?: string;
}

export default function SeguridadRequisitosVision({ className }: SeguridadRequisitosVisionProps) {
  return (
    <section className={`py-16 bg-background text-foreground ${className || ""}`}>
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        <InfoCard
          title="Requisitos"
          icon="📋"
          items={[
            "✔ Educación Secundaria completa",
            "✔ Interés por la prevención y seguridad laboral",
            
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Modalidad de Estudio"
          icon="🏫"
          items={[
            "📌 <strong>Modalidad presencial</strong> con prácticas en campo",
            "📌 <strong>Talleres prácticos</strong> en entornos simulados",
            "📌 <strong>Visitas técnicas</strong> a empresas e industrias",
          ]}
          className="bg-card text-card-foreground"
        >
          🛡️ Formación teórico-práctica con enfoque profesional
        </InfoCard>

        <InfoCard
          title="Ventajas de la Carrera"
          icon="🎯"
          items={[
            "📈 <strong>Alta empleabilidad:</strong> obligatorio en todas las empresas",
            "✅ <strong>Amplio campo laboral:</strong> aplicable a todos los sectores productivos",
            "⚖️ <strong>Marco legal sólido:</strong> respaldado por leyes nacionales"
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Competencias Clave"
          icon="🌟"
          items={[
            "🛡️ Identificación y evaluación de riesgos laborales",
            "📝 Elaboración de planes de prevención y emergencia",
            "🔍 Inspección y auditoría de condiciones de trabajo",
            "🧯 Control de cumplimiento normativo",
            "📊 Capacitación en seguridad para el personal"
          ]}
          className="bg-card text-card-foreground"
        />

        <InfoCard
          title="Salida Laboral"
          icon="🏭"
          className="bg-card text-card-foreground"
        >
          <p className="text-lg text-muted-foreground">
            Podrás trabajar en empresas industriales, constructoras, hospitales, 
            entidades gubernamentales, aseguradoras o como consultor independiente 
            realizando auditorías y capacitaciones.
          </p>
        </InfoCard>

        <InfoCard
          title="Certificaciones"
          icon="📜"
          items={[
            "✅ Certificación profesional habilitante",
            "✅ Matrícula en el Registro Nacional de Profesionales",
            "✅ Especializaciones en riesgos específicos"
          ]}
          className="bg-card text-card-foreground"
        />

      </div>
    </section>
  );
}