import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15, ease: 'easeIn' } },
};

export function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col min-h-0">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
