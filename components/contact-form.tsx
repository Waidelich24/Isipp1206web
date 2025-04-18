"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { CheckCircle } from "lucide-react"
import emailjs from "@emailjs/browser"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FormData = {
  name: string
  email: string
  career: string
  message: string
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCareer, setSelectedCareer] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>()

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("I-Z7Tyxj1k_O9tC8P")
  }, [])

  // Watch the career field for changes
  const careerValue = watch("career")

  // Update the career value when selected from dropdown
  const handleCareerChange = (value: string) => {
    setValue("career", value)
    setSelectedCareer(value)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Create subject line based on selected career
      const subjectLine = `[Consulta] ${data.career} – ${data.name}`

      // Prepare template parameters
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        career: data.career,
        message: data.message,
        subject: subjectLine,
      }

      // Send email using EmailJS
      await emailjs.send("service_r02i4mj", "template_51yca84", templateParams, "I-Z7Tyxj1k_O9tC8P")

      setIsSubmitted(true)
      reset()
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error("Error sending email:", err)
      setError("Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h3 className="text-xl font-semibold">¡Mensaje enviado!</h3>
          <p className="mt-2 text-muted-foreground">Nos pondremos en contacto contigo a la brevedad.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Ingresa tu nombre"
              {...register("name", { required: "Este campo es obligatorio" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="career">Carrera de interés</Label>
            <Select onValueChange={handleCareerChange} value={careerValue}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Analista de Sistemas">Analista de Sistemas</SelectItem>
                <SelectItem value="Tec. en Seguridad e Higiene">Tec. en Seguridad e Higiene</SelectItem>
                <SelectItem value="Tec. en Redes">Tec. en Redes</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("career", { required: "Por favor selecciona una carrera" })} />
            {errors.career && <p className="text-sm text-red-500">{errors.career.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              placeholder="Escribe tu consulta aquí..."
              {...register("message", { required: "Este campo es obligatorio" })}
              className={`min-h-[100px] ${errors.message ? "border-red-500" : ""}`}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </form>
      )}
    </div>
  )
}
