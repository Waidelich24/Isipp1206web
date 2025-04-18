"use client"

import { motion } from "framer-motion"

export function MapSection() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-900">
      <div className="container px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">Ubicación</h2>
          <p className="mt-4 text-lg text-muted-foreground">Visitanos en nuestra sede central</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-lg border border-primary shadow-xl"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895483!2d-58.38375908417525!3d-34.60373446500075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac630121623%3A0x53386f2ac88991a9!2sTeatro%20Col%C3%B3n!5e0!3m2!1sen!2sar!4v1649260914259!5m2!1sen!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            ></iframe>
          </div>
          <motion.div
            className="bg-white p-6 dark:bg-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-playfair text-xl font-semibold">Instituto Superior ISIPP 1206</h3>
            <p className="mt-2 text-muted-foreground">Puerto Piray, Misiones, Argentina – Calle Sarmiento</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="font-medium text-primary">Teléfono</p>
                <p className="text-muted-foreground">
                  <s>+54 11 4567-8900</s> <span className="text-xs italic">(No disponible aún)</span>
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="font-medium text-primary">Email</p>
                <p className="text-muted-foreground">isip1206@gmail.com</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="font-medium text-primary">Horario</p>
                <p className="text-muted-foreground">Lunes a Viernes: 8:00 - 21:00</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
