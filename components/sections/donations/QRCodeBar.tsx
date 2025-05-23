// Componente QRCodeBox con QR clásico (azul/blanco)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';

type MercadoPagoQRProps = {
  amount?: number;
  description?: string;
  bankDetails?: {
    cvu: string;
    alias: string;
    bank: string;
  };
};

const QRCodeBox = ({ 
  amount = 1000, 
  description = "Donación",
  bankDetails = {
    cvu: '0000003100206754897501',
    alias: 'TU.ALIAS.MP',
    bank: 'Banco de la Nación Argentina'
  }
}: MercadoPagoQRProps) => {
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Estilos simplificados para el QR clásico
  const styles = {
    headerBg: 'bg-[hsl(var(--primary))]',
    textColor: 'text-[hsl(var(--primary-foreground))]',
    cardBg: 'bg-[hsl(var(--card))]',
    cardBorder: 'border-[hsl(var(--border))]',
    buttonBg: 'bg-blue-600 hover:bg-blue-700', // Azul clásico
    buttonText: 'text-white',
    errorText: 'text-red-500',
    infoText: 'text-gray-600 dark:text-gray-400'
  };

  const fetchQrData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/generate-mp-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar QR');
      if (!data.qr_code) throw new Error('No se recibió un código QR válido');

      setQrData(data.qr_code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQrData(); }, [amount, description]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[var(--radius)] shadow-lg overflow-hidden border ${styles.cardBorder} ${styles.cardBg} w-full max-w-xs`}
    >
      {/* Cabecera */}
      <div className={`${styles.headerBg} p-4 text-center`}>
        <h2 className={`${styles.textColor} text-xl font-bold flex items-center justify-center font-playfair`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Doná con QR
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="p-6 flex flex-col items-center">
        {loading ? (
          <div className="h-64 w-64 flex items-center justify-center">
            <div className="animate-pulse rounded-lg bg-gray-200 h-48 w-48" />
          </div>
        ) : error ? (
          <div className={`${styles.errorText} p-4 text-center`}>{error}</div>
        ) : (
          <>
            {/* QR Clásico - Azul y Blanco */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative p-4 bg-white rounded-lg border-2 border-gray-200 mb-4"
            >
              <QRCode
                value={qrData}
                size={180}
                bgColor="#ffffff"  // Fondo blanco
                fgColor="#2563eb"  // Azul estándar (blue-600)
                level="H"
              />
            </motion.div>

            <div className="w-full text-center">
              <p className={`${styles.infoText} mb-4 text-sm`}>
                Escaneá el código con Mercado Pago
              </p>

              <div className="relative">
                <div className={`flex items-center border ${styles.cardBorder} rounded-lg overflow-hidden`}>
                  <span className={`px-3 py-2 bg-gray-100 ${styles.infoText} text-sm truncate max-w-[180px]`}>
                    {qrData}
                  </span>
                  <button
                    onClick={() => copyToClipboard(qrData)}
                    className={`px-3 py-2 ${styles.buttonBg} ${styles.buttonText} transition-colors`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>

                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -top-8 left-0 right-0 bg-blue-600 text-white text-xs py-1 rounded`}
                  >
                    ¡Enlace copiado!
                  </motion.div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sección de datos bancarios (se mantiene igual) */}
      <div className={`bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t ${styles.cardBorder}`}>
        <div className="space-y-3">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-1">Transferencia Bancaria</h3>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className={styles.infoText}>CVU:</span>
                  <span className="font-mono">{bankDetails.cvu}</span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.infoText}>Alias:</span>
                  <span className="font-semibold">{bankDetails.alias}</span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.infoText}>Banco:</span>
                  <span>{bankDetails.bank}</span>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(bankDetails.cvu)}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copiar CVU
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRCodeBox;