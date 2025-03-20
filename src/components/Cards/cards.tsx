import type React from "react"
import "./cards.css"

interface WeatherCardProps {
  type: "temperature" | "humidity" | "rain" | "sunIntensity"
  value: number | string
  unit?: string
}

const WeatherCard: React.FC<WeatherCardProps> = ({ type, value, unit = "" }) => {
  const getTitle = () => {
    switch (type) {
      case "temperature":
        return "Temperatura"
      case "humidity":
        return "Humedad"
      case "rain":
        return "Lluvia"
      case "sunIntensity":
        return "Intensidad del sol"
      default:
        return ""
    }
  }

  const getIcon = () => {
    switch (type) {
      case "temperature":
        return null
      case "humidity":
        return null
      case "rain":
        return <div className="weather-icon"></div>
      case "sunIntensity":
        return <div className="weather-icon"></div>
      default:
        return null
    }
  }

  const getIntensityClass = () => {
    if (typeof value !== "number" && typeof value !== "string") {
      return "low"
    }

    const numValue = typeof value === "string" ? Number.parseFloat(value) : value

    if (isNaN(numValue)) {
      return "low"
    }

    if (type === "rain") {
      if (numValue <= 0) return "none"
      if (numValue < 5) return "low"
      if (numValue < 15) return "medium"
      return "high"
    }

    if (type === "sunIntensity") {
      if (numValue < 30) return "low"
      if (numValue < 70) return "medium"
      return "high"
    }

    return ""
  }

  const renderValue = () => {
    // Para temperatura y humedad, mostrar solo el valor numérico
    if (type === "temperature" || type === "humidity") {
      return (
        <div className="weather-value">
          {value}
          <span className="weather-unit">{unit}</span>
        </div>
      )
    }

    const intensityClass = getIntensityClass()

    return (
      <div className="weather-content-with-icon">
        <div className={`weather-icon ${intensityClass}`}>{getIcon()}</div>
        <div className="weather-value">
          {value}
          <span className="weather-unit">{unit}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`weather-card ${type}-card`}>
      <h3 className="weather-title">{getTitle()}</h3>
      <div className="weather-content">{renderValue()}</div>
    </div>
  )
}

export default WeatherCard

