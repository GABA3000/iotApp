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
        return <div className="weather-icon rain-icon"></div>
      case "sunIntensity":
        return <div className="weather-icon sun-icon"></div>
      default:
        return null
    }
  }

  const renderValue = () => {
    if (type === "rain" || type === "sunIntensity") {
      return getIcon()
    }
    return (
      <div className="weather-value">
        {value}
        <span className="weather-unit">{unit}</span>
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

