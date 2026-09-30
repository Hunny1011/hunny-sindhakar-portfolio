"use client";

import { motion, useReducedMotion } from "motion/react";

const COLORS = ["var(--honey)", "var(--violet)", "var(--ink)", "var(--honey-soft)"];

// Little burst of "selection handles" when a message is sent. Loaded lazily.
export default function Celebration() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span className="confetti" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const dist = 70 + (i % 4) * 26;
        return (
          <motion.i
            key={i}
            style={{ background: COLORS[i % COLORS.length], borderRadius: i % 3 === 0 ? "50%" : 1 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1, rotate: 180 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: (i % 5) * 0.02 }}
          />
        );
      })}
    </span>
  );
}
