import { motion } from 'framer-motion';
import clsx from 'clsx';

export const AppCard = ({ children, className, hover = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "bg-card border border-white/5 shadow-lg rounded-2xl",
        hover && "transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
