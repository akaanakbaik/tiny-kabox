import React from "react"
import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Toaster from "./components/Toaster"
import GlobalLoading from "./components/GlobalLoading"
import { AppProvider } from "./state/AppProvider"

export default function App() {
  const element = useRoutes(routes)

  return (
    <AppProvider>
      <div className="min-h-dvh bg-surface text-foreground">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/[0.02] blur-3xl" />
        </div>

        <Header />

        <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-6 md:pt-8">
          {element}
        </main>

        <Footer />
        <Toaster />
        <GlobalLoading />
      </div>
    </AppProvider>
  )
}