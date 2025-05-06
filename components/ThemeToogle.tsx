"use client";

import { useTheme } from "@/components/ThemeProvider";
import { CiLight, CiDark } from "react-icons/ci";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme, isLoaded } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-16 h-8 flex items-center rounded-full disabled:cursor-not-allowed bg-accent dark:bg-highlight p-1 relative overflow-hidden"
      disabled={!isLoaded}
    >
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center absolute transition-colors duration-300 ${
          isLoaded ? "bg-yellow-300 dark:bg-black/40" : "bg-gray-400 animate-pulse"
        }`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          left: isLoaded
            ? theme === "light"
              ? "4px"
              : "calc(100% - 28px)"
            : "4px",
        }}
      >
        {isLoaded ? (
          theme === "light" ? (
            <CiLight className="text-black" size={20} />
          ) : (
            <CiDark className="text-white" size={20} />
          )
        ) : null}
      </motion.div>
    </button>
  );
}
