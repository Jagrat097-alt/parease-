"use client"

import { useEffect, useRef, useState } from "react"
import { MapControls } from "./map-controls"
import type { ParkingSpot, UserLocation } from "@/types/parking"

interface ParkingMapProps {
  parkingSpots: ParkingSpot[]
  userLocation: UserLocation | null
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot | null) => void
  isLoading: boolean
}

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

export function ParkingMap({
  parkingSpots,
  userLocation,
  selectedSpot,
  onSpotSelect,
  isLoading,
}: ParkingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const markersRef = useRef<Map<string, import("leaflet").Marker>>(new Map())
  const userMarkerRef = useRef<import("leaflet").Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window === "undefined") return

    // Add Leaflet CSS
    const linkExists = document.querySelector('link[href*="leaflet"]')
    if (!linkExists) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapRef.current) return

    const L = window.L
    const defaultCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [12.9716, 77.5946] // Bangalore default

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
    })

    // Dark themed tile layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map)

    map.on("click", () => {
      onSpotSelect(null)
    })

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mapLoaded, userLocation, onSpotSelect])

  // Update user location marker
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !userLocation) return

    const L = window.L

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
    } else {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; background: oklch(0.65 0.2 250); border-radius: 50%; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 4px; background: oklch(0.65 0.2 250); border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current)
    }
  }, [mapLoaded, userLocation])

  // Update parking markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    const L = window.L
    const map = mapRef.current
    const existingMarkers = markersRef.current

    // Remove markers that no longer exist
    for (const [id, marker] of existingMarkers) {
      if (!parkingSpots.find((s) => s.id === id)) {
        marker.remove()
        existingMarkers.delete(id)
      }
    }

    // Add or update markers
    for (const spot of parkingSpots) {
      const isSelected = selectedSpot?.id === spot.id
      const statusColor =
        spot.availability === "high"
          ? "#10b981"
          : spot.availability === "medium"
            ? "#f59e0b"
            : "#ef4444"

      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: ${isSelected ? "scale(1.2)" : "scale(1)"}; transition: transform 0.2s;">
          ${isSelected ? `<div style="position: absolute; width: 48px; height: 48px; background: ${statusColor}; border-radius: 50%; opacity: 0.3; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ""}
          <div style="position: relative; width: 40px; height: 40px; background: ${statusColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px ${statusColor}40; border: 3px solid ${statusColor}30;">
            <span style="color: white; font-weight: bold; font-size: 14px;">P</span>
          </div>
          <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid ${statusColor}; margin-top: -2px;"></div>
          <div style="background: rgba(23, 23, 31, 0.95); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 4px 8px; margin-top: 4px; white-space: nowrap;">
            <div style="color: white; font-size: 11px; font-weight: 600; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">${spot.name}</div>
            <div style="color: rgba(255,255,255,0.6); font-size: 10px;">${spot.spotsAvailable} spots</div>
          </div>
        </div>
      `

      const icon = L.divIcon({
        className: "parking-marker",
        html: markerHtml,
        iconSize: [140, 90],
        iconAnchor: [70, 58],
      })

      if (existingMarkers.has(spot.id)) {
        existingMarkers.get(spot.id)!.setIcon(icon)
      } else {
        const marker = L.marker([spot.lat, spot.lng], { icon })
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e)
            onSpotSelect(spot)
          })
          .addTo(map)
        existingMarkers.set(spot.id, marker)
      }
    }
  }, [mapLoaded, parkingSpots, selectedSpot, onSpotSelect])

  // Pan to selected spot
  useEffect(() => {
    if (!mapRef.current || !selectedSpot) return
    mapRef.current.panTo([selectedSpot.lat, selectedSpot.lng], { animate: true })
  }, [selectedSpot])

  const handleZoomIn = () => {
    mapRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut()
  }

  const handleRecenter = () => {
    if (!mapRef.current) return
    if (userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true })
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Map Controls */}
      <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onRecenter={handleRecenter} />

      {/* Loading Overlay */}
      {(isLoading || !mapLoaded) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">
              {!mapLoaded ? "Loading map..." : "Finding nearby parking..."}
            </p>
          </div>
        </div>
      )}

      {/* Custom styles for Leaflet */}
      <style jsx global>{`
        .leaflet-container {
          background: oklch(0.12 0.01 260);
          font-family: inherit;
        }
        .leaflet-control-attribution {
          background: oklch(0.17 0.01 260) !important;
          color: oklch(0.65 0 0) !important;
          font-size: 10px;
          padding: 2px 6px;
        }
        .leaflet-control-attribution a {
          color: oklch(0.72 0.19 145) !important;
        }
        .parking-marker,
        .user-location-marker {
          background: none !important;
          border: none !important;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
