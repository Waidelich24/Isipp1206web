import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Globe } from 'lucide-react';  // Importando Globe como ejemplo

const icons = [
  {
    href: 'https://www.instagram.com/isipp_1206/',
    icon: Instagram,
    bg: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    href: 'https://facebook.com',
    icon: Facebook,
    bg: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    href: 'https://linkedin.com',
    icon: Linkedin,
    bg: 'bg-blue-700 hover:bg-blue-800',
  },
];

const gap = 60; // espaciado vertical entre íconos

const iconVariants = {
  closed: (i: number) => ({
    y: 0,
    opacity: 0,
    transition: {
      duration: 0.4,
      delay: (icons.length - i - 1) * 0.08,
      ease: 'easeInOut',
    },
  }),
  open: (i: number) => ({
    y: -((i + 1) * gap),
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: 'easeInOut',
    },
  }),
};

export default function SocialBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Íconos */}
      {icons.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.a
            key={item.href}
            href={item.href}
            target="_blank"
            className={`absolute right-0 ${item.bg} p-3 rounded-full shadow-lg`}
            custom={i}
            variants={iconVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
          >
            <Icon className="text-white" size={24} />
          </motion.a>
        );
      })}

      {/* Botón central con ícono de red */}
      <motion.button
        onClick={() => setIsOpen(o => !o)}
        className="relative z-10 bg-[#590835] p-4 rounded-full shadow-lg hover:bg-[#7a1d48] focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Aquí cambiamos el + o × por un ícono de redes */}
        <Globe className="text-white" size={24} />
      </motion.button>
    </div>
  );
}
