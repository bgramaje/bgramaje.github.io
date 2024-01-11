import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"

import './App.css'
import Header from "./components/header/Header"
import Main from "./components/main/Main"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col gap-6 font-sans justify-start text-left">
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  )
}

export default App
