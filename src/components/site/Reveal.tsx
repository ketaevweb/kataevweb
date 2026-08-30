"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Обёртка для плавного появления секций при скролле.
 * Аналог приёма «анимации появления на framer-motion» из плана 3-й недели.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
