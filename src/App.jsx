import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, domAnimation, motion } from 'framer-motion'
import { useUserStore } from './store/userStore'
import { useNotificationScheduler } from './hooks/useNotificationScheduler'
import { pageTransition } from './animations/variants'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import NotificationBanner from './components/NotificationBanner'
import AnimatedBackground from './components/AnimatedBackground'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Tracker from './pages/Tracker'
import Goals from './pages/Goals'

const Chat = lazy(() => import('./pages/Chat'))

function AnimatedRoutes() {
  const location = useLocation()
  const withTransition = (Component) => (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      <Component />
    </motion.div>
  )

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(Home)} />
        <Route path="/tracker" element={withTransition(Tracker)} />
        <Route path="/goals" element={withTransition(Goals)} />
        <Route
          path="/chat"
          element={
            withTransition(() => (
              <Suspense fallback={<div className="loading-spinner">Loading chat…</div>}>
                <Chat />
              </Suspense>
            ))
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  useNotificationScheduler()
  return (
    <motion.div className="app-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <AnimatedBackground />
      <Header />
      <NotificationBanner />
      <main className="app-main">
        <AnimatedRoutes />
      </main>
      <BottomNav />
    </motion.div>
  )
}

export default function App() {
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)
  if (!onboardingComplete) return <Onboarding />
  return (
    <LazyMotion features={domAnimation}>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </LazyMotion>
  )
}
