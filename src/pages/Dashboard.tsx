
import { useEffect, useState } from "react"
import { obtenerLecturas } from "../services/api"
import Map from "../components/Map/map"
import WeatherCard from "../components/Cards/cards"
import Header from "../components/Header/header"
import "../App.css"
import Footer from "../components/Footer/footer"
import Sidebar from "../components/Sidebar/sidebar"

export default function Dashboard() {

  const [weatherData, setWeatherData] = useState({
    temperature: "Cargando...",
    humidity: "Cargando...",
    rain: "Cargando...",
    sunIntensity: "Cargando...",
  })

  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await obtenerLecturas()

        if (!data || !Array.isArray(data) || data.length === 0) {
          
          setError("No se encontraron lecturas disponibles.")
          setLoading(false)
          return
        }

        console.log("📡 Datos recibidos:", data)

        const ultimaLectura = data[data.length - 1]

        setWeatherData({


          temperature: ultimaLectura.temperatura ?? "No disponible",
          humidity: ultimaLectura.humedad ?? "No disponible",
          rain: ultimaLectura.lluvia ?? "No disponible",
          sunIntensity: ultimaLectura.sol ?? "No disponible",
        })

        const parsedLocations = data.map((lectura: any) => {

          const parcela = lectura.parcela
          if (!parcela?.latitud || !parcela?.longitud) return null

          return {

            id: parcela.id,
            name: parcela.nombre,
            lat: parseFloat(parcela.latitud),
            lng: parseFloat(parcela.longitud),
            temperatura: lectura.temperatura,

            humedad: lectura.humedad,
            lluvia: lectura.lluvia,
            sol: lectura.sol,
            parcelaData: parcela,
          }
        }).filter(Boolean)

        setLocations(parsedLocations)

      } catch (error) {

        console.error("🚨 Error al obtener datos:", error)
        setError("Error al obtener datos del backend.")

      } finally {

        setLoading(false)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="dashboard-container">


      <Sidebar />

      <div className="main-content">

        <Header title="IoT Dashboard | Estadísticas IoT" />
        <div className="dashboard-content">
          <div className="content-wrapper">
            <div className="map-container">
              {loading ? (
                <div className="loading-container">Cargando datos...</div>
              ) : error ? (
                <div className="error-container">{error}</div>
              ) : (

                <Map locations={locations} />
              )}
            </div>


            <div className="weather-cards">
              
              <WeatherCard type="temperature" value={weatherData.temperature} unit="°C" />
              <WeatherCard type="humidity" value={weatherData.humidity} unit="%" />
              <WeatherCard type="rain" value={weatherData.rain} unit="mm" />
              <WeatherCard type="sunIntensity" value={weatherData.sunIntensity} unit="%" />
            </div>
          </div>

        </div>
        


        <Footer />
      </div>



    </div>
  )
}

