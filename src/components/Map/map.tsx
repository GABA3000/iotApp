"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "./map.css"

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXN0cm9ncjE2IiwiYSI6ImNtODRvaXRxcDEwdGUya29zdm9najY2YzYifQ.sYq3Wt4uufTQM0_CohRR0g"

mapboxgl.accessToken = MAPBOX_TOKEN

interface Parcela {

  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string
  latitud?: number
  longitud?: number
  [key: string]: any
}

interface Location {

  id: number
  name: string
  lat: number
  lng: number
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
  parcelaData?: Parcela
}


interface MapProps {

  locations: Location[]
}

const Map: React.FC<MapProps> = ({ locations }) => {

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [zoom] = useState(12)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {

    if (!mapContainer.current) return

    if (!mapboxgl.accessToken) {
      setMapError("Se requiere un token de acceso válido para Mapbox")
      return
    }

    const validLocations = locations.filter((loc) => !isNaN(loc.lat) && !isNaN(loc.lng))

    if (validLocations.length === 0) {
      if (locations.length > 0) {
        setMapError("No hay ubicaciones válidas para mostrar en el mapa")
      }
      return
    } else {
      setMapError(null)
    }

    const initialCenter: [number, number] = [validLocations[0].lng, validLocations[0].lat]

    try {

      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: initialCenter,
          zoom: zoom,
        })

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

        map.current.on("error", (e) => {

          console.error("Error en el mapa:", e)
          setMapError(`Error al cargar el mapa: ${e.error?.message || "Error desconocido"}`)
        })

      } else {
        map.current.flyTo({ center: initialCenter, zoom: zoom })
      }

      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      validLocations.forEach((location) => {
        const popupContent = createPopupContent(location)

        const marker = new mapboxgl.Marker({ color: "#B03A2E" })
          .setLngLat([location.lng, location.lat])
          .setPopup(new mapboxgl.Popup({ maxWidth: "300px" }).setHTML(popupContent))
          .addTo(map.current!)

        markersRef.current.push(marker)
      })
    } catch (error) {

      console.error("Error al inicializar el mapa:", error)
      setMapError(`Error al inicializar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
    }
  }, [locations, zoom])

  const createPopupContent = (location: Location): string => {
    const parcela = location.parcelaData

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      } catch (e) {
        return dateString
      }
    }

    const formattedDate = parcela?.ultimo_riego ? formatDate(parcela.ultimo_riego) : "Sin información"

    return `
      <div class="popup-content">

        <h3>${parcela?.nombre ?? location.name}</h3>
        <div class="popup-details">
          <p><strong>Ubicación:</strong> ${parcela?.ubicacion ?? "No disponible"}</p>
          <p><strong>Responsable:</strong> ${parcela?.responsable ?? "No disponible"}</p>
          <p><strong>Tipo de cultivo:</strong> ${parcela?.tipo_cultivo ?? "No disponible"}</p>
          <p><strong>Último riego:</strong> ${formattedDate}</p>
          <div class="popup-sensors">
            <div class="sensor-reading temperature">
              <span class="sensor-value">${location.temperatura}°C</span>
              <span class="sensor-label">Temperatura</span>
            </div>

            <div class="sensor-reading humidity">

              <span class="sensor-value">${location.humedad}%</span>
              <span class="sensor-label">Humedad</span>
            </div>
            <div class="sensor-reading lluvia">
              <span class="sensor-value">${location.lluvia} mm</span>
              <span class="sensor-label">Lluvia</span>
            </div>

            <div class="sensor-reading sol">

              <span class="sensor-value">${location.sol}%</span>
              <span class="sensor-label">Intensidad del Sol</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  return (
    <div className="map-container">

      {mapError ? (
        <div className="map-error">
          
          <p>{mapError}</p>
          <p className="map-error-help">Verificar token</p>
        </div>
      ) : (
        <div ref={mapContainer} className="map" />
      )}
    </div>
  )
}

export default Map
