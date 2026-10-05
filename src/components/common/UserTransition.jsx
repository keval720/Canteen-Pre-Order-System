import { AnimatePresence, motion } from "motion/react";

const UserTransition = ({ children, routeKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{
          opacity: 0,
          x: 25,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: -25,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default UserTransition;
