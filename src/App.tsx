import { ThemeProvider } from "@/components/theme-provider"

import './App.css'

import Main from "./components/main/Main"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col gap-6 font-sans justify-start text-left">
          <Main />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
