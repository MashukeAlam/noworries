import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import "./App.css"
import Landing from "./pages/Landing.jsx"
import Recorder from "./pages/Recorder.jsx"
import Features from "./pages/Features.jsx"

function Shell({ children }) {
  return (
    <div className="min-h-full">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-10rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">NoWorries</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-200">
            <Link className="hover:text-white" to="/features">Features</Link>
            <Link className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/15" to="/app">Open App</Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mt-16 border-t border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-slate-300">
          <span>© {new Date().getFullYear()} NoWorries</span>
          <span className="text-slate-400">Make recordings you’re proud to share.</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell><Landing /></Shell>} />
        <Route path="/features" element={<Shell><Features /></Shell>} />
        <Route path="/app" element={<Shell><Recorder /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}
