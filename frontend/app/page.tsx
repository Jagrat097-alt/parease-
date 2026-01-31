"use client"

import { useState, useEffect, useCallback } from "react"
import { ParkingMap } from "@/components/parking-map"
import { ParkingHeader } from "@/components/parking-header"
import { ParkingBottomSheet } from "@/components/parking-bottom-sheet"
import { generateNearbyParkingSpots } from "@/lib/parking-data"
import type { ParkingSpot, UserLocation } from "@/types/parking"

export default function ParkEasePage() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
  const [allSpots, setAllSpots] = useState<ParkingSpot[]>([])

  // Simulate getting user's real location
  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setIsLoading(false)
          },
          () => {
            // Fallback to default Bangalore location
            setUserLocation({
              lat: 12.9716,
              lng: 77.5946,
            })
            setIsLoading(false)
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
      } else {
        // Fallback if geolocation not supported
        setUserLocation({
          lat: 12.9716,
          lng: 77.5946,
        })
        setIsLoading(false)
      }
    }

    // Simulate loading delay for better UX
    const timer = setTimeout(getLocation, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Generate parking spots around user location
  useEffect(() => {
    if (userLocation) {
      const spots = generateNearbyParkingSpots(userLocation.lat, userLocation.lng)
      setAllSpots(spots)
      setParkingSpots(spots)
    }
  }, [userLocation])

  // Update user location in real-time
  useEffect(() => {
    if (!("geolocation" in navigator)) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // Filter parking spots based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setParkingSpots(allSpots)
      return
    }

    const filtered = allSpots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setParkingSpots(filtered)
  }, [searchQuery, allSpots])

  const handleSpotSelect = useCallback((spot: ParkingSpot | null) => {
    setSelectedSpot(spot)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setSelectedSpot(null)
  }, [])

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
      {/* Header with Search */}
      <ParkingHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Interactive Map */}
      <ParkingMap
        parkingSpots={parkingSpots}
        userLocation={userLocation}
        selectedSpot={selectedSpot}
        onSpotSelect={handleSpotSelect}
        isLoading={isLoading}
      />

      {/* Bottom Sheet */}
      <ParkingBottomSheet
        spot={selectedSpot}
        onClose={handleCloseSheet}
        userLocation={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null}
      />

      {/* Location Status Badge */}
      {userLocation && !isLoading && (
        <div className="absolute bottom-4 left-4 z-30">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-2 border border-border shadow-lg">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Live location active</span>
          </div>
        </div>
      )}
    </main>
  )
}
