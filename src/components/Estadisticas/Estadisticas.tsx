import "./Estadisticas.css" // Nuevo archivo CSS que te daré abajo
import { obtenerLecturas } from "../../services/api"
import { useEffect, useState } from "react"
import { Line, Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function Estadisticas() {
  const [labels, setLabels] = useState<string[]>([])
  const [temperatura, setTemperatura] = useState<number[]>([])
  const [humedad, setHumedad] = useState<number[]>([])
  const [lluvia, setLluvia] = useState<number[]>([])
  const [sol, setSol] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const datos = await obtenerLecturas()
      if (!datos) return

      const fechas = datos.map((d: any) => new Date(d.fecha).toLocaleDateString("es-MX"))
      setLabels(fechas)
      setTemperatura(datos.map((d: any) => d.temperatura))
      setHumedad(datos.map((d: any) => d.humedad))
      setLluvia(datos.map((d: any) => d.lluvia))
      setSol(datos.map((d: any) => d.sol))
    }

    fetchData()
  }, [])

  return (
    <div className="estadisticas-container">
      <div className="grafica">
        <h2>📈 Temperatura y Humedad (Líneas)</h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Temperatura (°C)",
                data: temperatura,
                borderColor: "#ff6384",
                backgroundColor: "#ff6384",
              },
              {
                label: "Humedad (%)",
                data: humedad,
                borderColor: "#36a2eb",
                backgroundColor: "#36a2eb",
              },
            ],
          }}
        />
      </div>

      <div className="grafica">
        <h2>📊 Lluvia (Barras)</h2>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Lluvia (mm)",
                data: lluvia,
                backgroundColor: "#4bc0c0",
              },
            ],
          }}
        />
      </div>

      <div className="grafica">
        <h2>🥧 Intensidad Solar (Pastel)</h2>
        <Pie
          data={{
            labels,
            datasets: [
              {
                label: "Intensidad del Sol",
                data: sol,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  )
}
