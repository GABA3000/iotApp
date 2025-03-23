import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import EstadisticasPage from "./pages/estadisticas_graficos"

function App() {

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
      </Routes>
    </Router>
    
  )
}

export default App
