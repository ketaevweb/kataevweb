"use client";

import { MotionConfig } from "framer-motion";

/**
 * Обёртка MotionConfig (гипотеза аудита 04.09 → подтверждена пользователем).
 * При системной настройке prefers-reduced-motion: reduce framer-motion
 * гасит transform/position-анимации (Reveal и т.п.), оставляя только opacity —
 * анимации не исчезают полностью и не ломают вёрстку (WCAG 2.3.3).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
