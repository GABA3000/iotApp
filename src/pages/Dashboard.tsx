"use client"

import { useEffect, useState } from "react"
import { getIotData } from "../services/api"
import Map from "../components/Map/map"
import WeatherCard from "../components/Cards/cards"
import Header from "../components/Header/header"
import "../App.css"
import Footer from "../components/Footer/footer"
import Sidebar from "../components/Sidebar/sidebar"

interface ParcelaSensor {
  humedad: number
  temperatura: number
  [key: string]: any
}

interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string
  sensor: ParcelaSensor
  latitud?: number
  longitud?: number
  [key: string]: any
}

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

        if (!data) {
          setError("No se pudieron obtener datos de la API")
          setLoading(false)
          return
        }

        console.log("📡 Datos recibidos de la API:", data)

        if (!data.sensores) {
          console.error("⚠️ Error: La API no devolvió la estructura esperada.")
          setError("La API no devolvió la estructura esperada")
          return
        }

        setWeatherData({
          temperature: data.sensores.temperatura ?? "No disponible",
          humidity: data.sensores.humedad ?? "No disponible",
          rain: data.sensores.lluvia !== undefined ? (data.sensores.lluvia > 0 ? "Sí" : "No") : "No disponible",
          sunIntensity: data.sensores.sol ?? "No disponible",
        })

        // Procesar las parcelas para el mapa
        const parsedLocations = (data.parcelas || [])
          .map((parcela: Parcela) => {
            // Intentar obtener coordenadas
            let lat, lng

            // Si la API proporciona latitud/longitud directamente
            if (parcela.latitud !== undefined && parcela.longitud !== undefined) {
              lat = Number.parseFloat(String(parcela.latitud))
              lng = Number.parseFloat(String(parcela.longitud))
            } else {
              // Coordenadas de ejemplo basadas en el ID de la parcela para demostración
              // En un caso real, estas coordenadas deberían venir de la API
              const demoCoordinates: Record<number, [number, number]> = {
                1: [25.6866, -100.3161], // Parcela 1
                2: [25.6896, -100.3131], // Parcela 2
                3: [25.6836, -100.3101], // Parcela 3
                4: [25.6806, -100.3071], // Parcela 4
                5: [25.6876, -100.3041], // Parcela 5
              }

              const defaultCoords = demoCoordinates[parcela.id] || [25.6866, -100.3161]
              lat = defaultCoords[0]
              lng = defaultCoords[1]
            }

            if (isNaN(lat) || isNaN(lng)) {
              console.warn("⚠️ Ubicación inválida detectada:", parcela)
              return null
            }

            return {
              id: parcela.id,
              name: parcela.nombre,
              lat,
              lng,
              parcelaData: parcela, // Incluir todos los datos de la parcela
            }
          })
          .filter(Boolean)

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

