import { AnimatePresence, motion } from "framer-motion";

const EaseAnimation = ({ children, animationKey, direction = "left" }) => {
  const xFrom = direction === "left" ? -40 : 40;
  const xTo = -xFrom;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}   
        layout
        initial={{ opacity: 0, x: xFrom }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: xTo }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default EaseAnimation;
