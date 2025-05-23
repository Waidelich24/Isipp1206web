"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Donor = {
  name: string;
  amount: number;
};

const DonorList = () => {
  const donorsData: Donor[] = [
    { name: "Angel Waidelich", amount: 50000000 },
    { name: "Luis Martínez", amount: 4500 },
    { name: "María Rodríguez", amount: 3500 },
    { name: "Carlos López", amount: 2000 },
    { name: "Sofia Fernández", amount: 1800 },
    { name: "Pedro González", amount: 1700 },
    { name: "Juan Pérez", amount: 1500 },
    { name: "Laura Sánchez", amount: 1400 },
    { name: "David Romero", amount: 1200 },
    { name: "Raúl Jiménez", amount: 1000 }
  ];

  const [donors] = useState<Donor[]>(donorsData);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Medal colors based on position
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return "bg-gradient-to-br from-yellow-400 to-yellow-600";
      case 2: return "bg-gradient-to-br from-gray-300 to-gray-400";
      case 3: return "bg-gradient-to-br from-amber-600 to-amber-800";
      default: return "bg-gradient-to-br from-blue-500 to-blue-600";
    }
  };

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Mayores Donadores</h3>
        <p className="text-gray-500">Nuestros mayores colaboradores</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <h4 className="text-white text-lg font-semibold flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Actualizado: {new Date().toLocaleDateString()}
          </h4>
        </div>
        
        <ul className="divide-y divide-gray-100">
          <AnimatePresence>
            {donors.slice(0, 10).map((donor, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative px-6 py-4 flex items-center transition-colors duration-150"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getMedalColor(index + 1)}`}></div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${getMedalColor(index + 1)} text-white font-bold`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-800 truncate">
                    {donor.name}
                    {hoveredIndex === index && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        Donador
                      </motion.span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">Donado {index % 2 === 0 ? "este mes" : "ultimo mes"}</p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xl font-bold text-green-600 mr-2">
                    ${donor.amount.toLocaleString()}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                
                {index === 0 && (
                  <div className="absolute -top-2 -right-0 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    Mayor Donador
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        

      </motion.div>
      

    </div>
  );
};

export default DonorList;