"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type DonationBarProps = {
  goal: number;
};

const DonationBar = ({ goal }: DonationBarProps) => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/donations")
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener donaciones:", err);
        setIsLoading(false);
      });
  }, []);

  const percent = Math.min((total / goal) * 100, 100);
  const formattedGoal = goal.toLocaleString("es-ES");
  const formattedTotal = total.toLocaleString("es-ES");

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ¡Ayúdanos a alcanzar nuestra meta!
      </h2>

      <div 
        className="mb-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-600 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Recaudado: <span className="text-green-600 font-bold">${formattedTotal}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-blue-600 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Meta: <span className="text-blue-600 font-bold">${formattedGoal}</span>
            </span>
          </div>
        </div>

        <div className="relative w-full h-8 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          {isLoading ? (
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          ) : (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.5, type: "spring" }}
              className={`h-full ${percent >= 100 
                ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                : "bg-gradient-to-r from-blue-500 to-cyan-500"}`}
            />
          )}
          
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded"
            >
              {percent.toFixed(1)}% completado
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-500">100%</span>
        </div>
      </div>

      {percent >= 100 ? (
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
              />
            </svg>
            ¡Meta alcanzada!
          </div>
          <p className="mt-2 text-gray-600">
            Gracias a todos por su increíble apoyo. ¡Sigan donando!
          </p>
        </div>
      ) : (
        <div className="text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Haz tu donación ahora
          </button>
          <p className="mt-3 text-gray-600">
            Faltan <span className="font-bold text-blue-600">${(goal - total).toLocaleString("es-ES")}</span> para alcanzar la meta
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <div className="flex space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            Meta actual
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            Donaciones
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonationBar;