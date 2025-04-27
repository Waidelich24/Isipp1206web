import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Globe } from 'lucide-react';

const icons = [
  {
    href: 'https://www.instagram.com/isipp_1206/',
    icon: Instagram,
    bg: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    href: 'https://web.facebook.com/people/Instituto-Superior-de-Inform%C3%A1tica/100094923631829/?_rdc=3&_rdr',
    icon: Facebook,
    bg: 'bg-blue-600 hover:bg-blue-700',
  },
 
];

const gap = 30;

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
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* CONTENEDOR RELATIVO */}
      <div className="relative flex flex-col items-center">
        {/* Íconos */}
        {icons.map((item, i) => {
          const Icon = item.icon;
          return (
<motion.a
  key={item.href}
  href={item.href}
  target="_blank"
  className={`absolute ${item.bg} p-3 rounded-full shadow-lg`}
  style={{ top: `-${(i + 1) * gap}px` }}
  initial="closed"
  animate={isOpen ? 'open' : 'closed'}
  variants={iconVariants}
  custom={i}
  whileHover={{
    x: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.3 },
  }}
>
  <Icon className="text-white" size={24} />
</motion.a>

          );
        })}

        {/* Botón + Tooltip */}
        <motion.div
          className="relative z-10 flex items-center"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          {/* Tooltip */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-white text-[#590835] px-3 py-1 rounded-lg shadow text-sm whitespace-nowrap"
          >
            Síguenos
          </motion.span>

          {/* Botón central */}
          <motion.button
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-[#590835] p-4 rounded-full shadow-lg hover:bg-[#7a1d48] focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Globe className="text-white" size={24} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}