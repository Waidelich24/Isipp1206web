"use client";

import DonationBar from "./dontarionbar";
import DonorList from "./donorlist";
import QRCodeBox from "./QRCodeBar";
import { motion } from "framer-motion";

const DonationSection = () => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Apoya Nuestra Causa</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu contribución hace posible nuestro trabajo. ¡Únete a nuestra comunidad de donantes!
          </p>
        </motion.div>

        {/* Grid reorganizado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda (QR + Barra) */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QRCodeBox />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DonationBar goal={25000} />
            </motion.div>
          </div>

          {/* Columna derecha (Lista de donantes) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <DonorList />
          </motion.div>
        </div>

        {/* Mensaje adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Cada donación, sin importar su tamaño, nos ayuda a seguir adelante con nuestro proyecto. 
            ¡Gracias por ser parte de esta comunidad solidaria!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DonationSection;