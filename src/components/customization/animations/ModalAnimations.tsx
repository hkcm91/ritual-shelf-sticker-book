
import { motion } from "framer-motion";

// Animation variants
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.165, 0.84, 0.44, 1],
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: {
      duration: 0.3,
      ease: [0.165, 0.84, 0.44, 1]
    }
  }
};

export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.165, 0.84, 0.44, 1]
    }
  }
};

export const AnimatedContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedChild = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={childVariants}
    className={className}
  >
    {children}
  </motion.div>
);
