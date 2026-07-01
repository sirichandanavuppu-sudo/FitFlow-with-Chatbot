export const easing = [0.23, 1, 0.32, 1]

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: easing } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const slideVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easing } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easing } },
}

export const staggerContainer = (staggerChildren = 0.07, delayChildren = 0.04) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
})

export const listStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

export const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: easing } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easing } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.18 } },
}
