"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "./map.css"

// Configurar el token de acceso de Mapbox
// Reemplaza esto con tu token real de Mapbox
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXN0cm9ncjE2IiwiYSI6ImNtODRvaXRxcDEwdGUya29zdm9najY2YzYifQ.sYq3Wt4uufTQM0_CohRR0g"
mapboxgl.accessToken = MAPBOX_TOKEN

interface Location {
  id: number
  name: string
  lat: number
  lng: number
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

    // Verificar si hay un token válido
    if (!mapboxgl.accessToken || mapboxgl.accessToken === "tu_token_de_mapbox_aqui") {
      setMapError("Se requiere un token de acceso válido para Mapbox")
      return
    }

    // Verificar si hay ubicaciones válidas
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
      // Si el mapa aún no se ha creado, lo inicializamos
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: initialCenter,
          zoom: zoom,
          // No usar transformRequest para evitar problemas de CORS
        })

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

        // Manejar errores de carga del mapa
        map.current.on("error", (e) => {
          console.error("Error en el mapa:", e)
          setMapError(`Error al cargar el mapa: ${e.error?.message || "Error desconocido"}`)
        })
      } else {
        // Si el mapa ya existe, solo actualizamos la vista
        map.current.flyTo({
          center: initialCenter,
          zoom: zoom,
        })
      }

      // Eliminar marcadores anteriores antes de añadir nuevos
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      // Agregar nuevos marcadores
      validLocations.forEach((location) => {
        const marker = new mapboxgl.Marker({ color: "#B03A2E" })
          .setLngLat([location.lng, location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`))
          .addTo(map.current!)

        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
      setMapError(`Error al inicializar el mapa: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }

    // Limpiar los marcadores cuando cambien las ubicaciones
    return () => {
      markersRef.current.forEach((marker) => marker.remove())
    }
  }, [locations, zoom])

  return (
    <div className="map-container">
      {mapError ? (
        <div className="map-error">
          <p>{mapError}</p>
          <p className="map-error-help">Verifica tu token de Mapbox en el archivo map.tsx</p>
        </div>
      ) : (
        <div ref={mapContainer} className="map" />
      )}
    </div>
  )
}

export default Map

