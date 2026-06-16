"use client";

import React from "react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-1 select-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-espresso-300 inline-block"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
export default TypingIndicator;
