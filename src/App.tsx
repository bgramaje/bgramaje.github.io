import { ThemeProvider } from "@/components/theme-provider"

import './App.css'

import AboutMe from "./components/main/content/AboutMe"
import Experience from "./components/main/content/Experience"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <AboutMe />
        <Experience />
      </div>
    </ThemeProvider>
  )
}

export default App
