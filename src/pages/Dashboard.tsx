"use client"

import { useEffect, useState } from "react"
import { getIotData } from "../services/api"
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
        const data = await getIotData()
        console.log("📡 Datos recibidos de la API:", data)

        if (!data || !data.sensores) {
          console.error("⚠️ Error: La API no devolvió la estructura esperada.")
          setError("La API no devolvió la estructura esperada")
          return
        }

        // Actualizar datos del clima
        setWeatherData({
          temperature: data.sensores.temperatura ?? "No disponible",
          humidity: data.sensores.humedad ?? "No disponible",
          rain: data.sensores.lluvia !== undefined ? (data.sensores.lluvia > 0 ? "Sí" : "No") : "No disponible",
          sunIntensity: data.sensores.sol ?? "No disponible",
        })

        // Extraer ubicaciones y validar datos
        const parsedLocations = (data.parcelas || [])
          .map((parcela: any) => {
            const lat = Number.parseFloat(parcela.latitud)
            const lng = Number.parseFloat(parcela.longitud)

            if (isNaN(lat) || isNaN(lng)) {
              console.warn("⚠️ Ubicación inválida detectada:", parcela)
              return null
            }

            return {
              id: parcela.id,
              name: parcela.nombre,
              lat,
              lng,
            }
          })
          .filter(Boolean) // Eliminar valores nulos

        console.log("📌 Ubicaciones extraídas:", parsedLocations)
        setLocations(parsedLocations)
      } catch (error) {
        console.error("🚨 Error al obtener los datos de la API:", error)
        setError(`Error al obtener datos: ${error instanceof Error ? error.message : "Error desconocido"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Configurar un intervalo para actualizar los datos cada 5 minutos
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    // Limpiar el intervalo cuando el componente se desmonte
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
              {loading && locations.length === 0 ? (
                <div className="loading-container">Cargando mapa...</div>
              ) : error ? (
                <div className="error-container">{error}</div>
              ) : (
                <Map locations={locations} />
              )}
            </div>
            <div className="weather-cards">
              <WeatherCard type="temperature" value={weatherData.temperature} unit="°C" />
              <WeatherCard type="humidity" value={weatherData.humidity} unit="%" />
              <WeatherCard type="rain" value={weatherData.rain} />
              <WeatherCard type="sunIntensity" value={weatherData.sunIntensity} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

