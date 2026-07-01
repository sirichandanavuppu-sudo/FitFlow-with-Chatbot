import { motion } from 'framer-motion'

const blobTransition = {
  duration: 16,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
}

export default function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <motion.div
        className="bg-blob bg-blob-primary"
        animate={{ x: [0, 24, -12, 0], y: [0, -18, 12, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={blobTransition}
      />
      <motion.div
        className="bg-blob bg-blob-accent"
        animate={{ x: [0, -22, 10, 0], y: [0, 16, -10, 0], scale: [1, 0.94, 1.06, 1] }}
        transition={{ ...blobTransition, duration: 18 }}
      />
      <motion.div
        className="bg-blob bg-blob-glow"
        animate={{ x: [0, 12, -16, 0], y: [0, 12, -8, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ ...blobTransition, duration: 20 }}
      />
    </div>
  )
}
