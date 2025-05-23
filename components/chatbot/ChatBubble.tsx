import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface ChatBubbleProps {
  onToggle: () => void;
}

export const ChatBubble = ({ onToggle }: ChatBubbleProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative z-10 flex items-center"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
        className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-white text-[#590835] px-3 py-1 rounded-lg shadow text-sm whitespace-nowrap"
      >
        Chatea con nosotros
      </motion.span>

      <motion.button
        onClick={onToggle}
        className="bg-[#590835] p-4 rounded-full shadow-lg hover:bg-[#7a1d48] focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="text-white" size={24} />
      </motion.button>
    </motion.div>
  );
};