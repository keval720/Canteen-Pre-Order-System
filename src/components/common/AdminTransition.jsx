import { AnimatePresence, motion } from "motion/react";

const AdminTransition = ({ children, routeKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{
          opacity: 0,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.985,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminTransition;
