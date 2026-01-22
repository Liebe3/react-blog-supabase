import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

function Loading() {
  const dotVariants: Variants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex">
      <motion.div
        className="w-full flex justify-center items-center gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="animate"
      >
        <motion.div className="dot" variants={dotVariants} animate="pulse" />
        <motion.div className="dot" variants={dotVariants} animate="pulse" />
        <motion.div className="dot" variants={dotVariants} animate="pulse" />
      </motion.div>
      <StyleSheet />
    </div>
  );
}

function StyleSheet() {
  return (
    <style>
      {`
        .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #059669;
          will-change: transform;
        }
      `}
    </style>
  );
}

export default Loading;
