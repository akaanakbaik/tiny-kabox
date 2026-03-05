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
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 md:px-6">
          {element}
        </main>
        <Footer />
        <Toaster />
        <GlobalLoading />
      </div>
    </AppProvider>
  )
}