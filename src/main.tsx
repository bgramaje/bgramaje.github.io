import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AnimatedCursor from "react-animated-cursor"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <AnimatedCursor
      innerSize={0}
      outerSize={130}
      color="3, 223, 252"
      outerAlpha={102}
      innerScale={0}
      outerScale={1}
      showSystemCursor
      outerStyle={{
        mixBlendMode: 'exclusion',
        filter: 'blur(7rem)'
      }}
    />
  </React.StrictMode>,
)
