import React from 'react';
import { motion } from 'framer-motion';

export const WordByWord = ({ text, className, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.08,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
