"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Car,
  ArrowLeft,
  Save,
  Plus,
  Minus,
  ParkingCircle,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ParkingSpotData {
  id: string
  name: string
  address: string
  totalSpots: number
  availableSpots: number
  pricePerHour: number
  operatingHours: string
  lastUpdated: Date
}

// Mock data for owner's parking spots
const initialParkingSpots: ParkingSpotData[] = [
  {
    id: "1",
    name: "MG Road Parking Complex",
    address: "MG Road, Near Metro Station",
    totalSpots: 120,
    availableSpots: 45,
    pricePerHour: 40,
    operatingHours: "24/7",
    lastUpdated: new Date(),
  },
  {
    id: "2",
    name: "Brigade Road Basement",
    address: "Brigade Road, Opposite Church",
    totalSpots: 80,
    availableSpots: 12,
    pricePerHour: 50,
    operatingHours: "6 AM - 11 PM",
    lastUpdated: new Date(),
  },
  {
    id: "3",
    name: "Residency Road Multi-Level",
    address: "Residency Road, Near Kamaraj Road Junction",
    totalSpots: 200,
    availableSpots: 78,
    pricePerHour: 60,
    operatingHours: "24/7",
    lastUpdated: new Date(),
  },
  {
    id: "4",
    name: "Commercial Street Parking",
    address: "Commercial Street, Main Entrance",
    totalSpots: 60,
    availableSpots: 5,
    pricePerHour: 35,
    operatingHours: "9 AM - 10 PM",
    lastUpdated: new Date(),
  },
  {
    id: "5",
    name: "Indiranagar Metro Parking",
    address: "100 Feet Road, Indiranagar",
    totalSpots: 100,
    availableSpots: 32,
    pricePerHour: 45,
    operatingHours: "5 AM - 11 PM",
    lastUpdated: new Date(),
  },
]

function getAvailabilityStatus(available: number, total: number) {
  const percentage = (available / total) * 100
  if (percentage > 30) return { label: "High", color: "bg-emerald-500", textColor: "text-emerald-400" }
  if (percentage > 10) return { label: "Medium", color: "bg-amber-500", textColor: "text-amber-400" }
  return { label: "Low", color: "bg-red-500", textColor: "text-red-400" }
}

function formatLastUpdated(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  return date.toLocaleDateString()
}

export default function ManageSpotsPage() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotData[]>(initialParkingSpots)
  const [editingSpot, setEditingSpot] = useState<ParkingSpotData | null>(null)
  const [tempAvailable, setTempAvailable] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedSpotName, setSavedSpotName] = useState("")

  const handleEditSpot = (spot: ParkingSpotData) => {
    setEditingSpot(spot)
    setTempAvailable(spot.availableSpots)
  }

  const handleQuickUpdate = (spotId: string, change: number) => {
    setParkingSpots(spots =>
      spots.map(spot => {
        if (spot.id === spotId) {
          const newAvailable = Math.max(0, Math.min(spot.totalSpots, spot.availableSpots + change))
          return {
            ...spot,
            availableSpots: newAvailable,
            lastUpdated: new Date(),
          }
        }
        return spot
      })
    )
  }

  const handleSaveSpot = () => {
    if (!editingSpot) return

    setParkingSpots(spots =>
      spots.map(spot => {
        if (spot.id === editingSpot.id) {
          return {
            ...spot,
            availableSpots: tempAvailable,
            lastUpdated: new Date(),
          }
        }
        return spot
      })
    )

    setSavedSpotName(editingSpot.name)
    setEditingSpot(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const totalAvailable = parkingSpots.reduce((sum, spot) => sum + spot.availableSpots, 0)
  const totalSpots = parkingSpots.reduce((sum, spot) => sum + spot.totalSpots, 0)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/owner/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ParkingCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Manage Spots</h1>
                  <p className="text-xs text-muted-foreground">Update availability in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{savedSpotName} updated successfully!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Available Spots</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalAvailable} <span className="text-base font-normal text-muted-foreground">/ {totalSpots}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(((totalSpots - totalAvailable) / totalSpots) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Spots List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Parking Locations</h2>
          
          {parkingSpots.map((spot) => {
            const status = getAvailabilityStatus(spot.availableSpots, spot.totalSpots)
            const occupiedSpots = spot.totalSpots - spot.availableSpots

            return (
              <Card key={spot.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{spot.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${status.textColor} border-current/20 bg-current/10`}
                          >
                            {status.label} Availability
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{spot.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{spot.availableSpots}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-amber-400">{occupiedSpots}</p>
                        <p className="text-xs text-muted-foreground">Occupied</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-foreground">{spot.totalSpots}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Capacity Usage</span>
                        <span className="font-medium text-foreground">
                          {Math.round((occupiedSpots / spot.totalSpots) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${status.color}`}
                          style={{ width: `${(occupiedSpots / spot.totalSpots) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Update Controls */}
                    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Updated {formatLastUpdated(spot.lastUpdated)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quick Update:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuickUpdate(spot.id, -1)}
                            disabled={spot.availableSpots <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-semibold text-foreground">
                            {spot.availableSpots}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuickUpdate(spot.id, 1)}
                            disabled={spot.availableSpots >= spot.totalSpots}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditSpot(spot)}
                      >
                        Set Exact Count
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => {
                          setParkingSpots(spots =>
                            spots.map(s => s.id === spot.id ? { ...s, availableSpots: spot.totalSpots, lastUpdated: new Date() } : s)
                          )
                          setSavedSpotName(spot.name)
                          setShowSuccess(true)
                          setTimeout(() => setShowSuccess(false), 3000)
                        }}
                      >
                        Mark All Available
                      </Button>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>{spot.pricePerHour}/hr</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{spot.operatingHours}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Low Availability Alert */}
        {parkingSpots.some(spot => (spot.availableSpots / spot.totalSpots) < 0.1) && (
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">Low Availability Alert</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Some of your parking locations are running low on available spots. 
                    Consider updating the availability if vehicles have left.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Spot Dialog */}
      <Dialog open={!!editingSpot} onOpenChange={(open) => !open && setEditingSpot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Available Spots</DialogTitle>
            <DialogDescription>
              {editingSpot?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editingSpot && (
            <div className="space-y-6 py-4">
              {/* Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Available Spots</Label>
                  <span className="text-2xl font-bold text-primary">{tempAvailable}</span>
                </div>
                <Slider
                  value={[tempAvailable]}
                  onValueChange={([value]) => setTempAvailable(value)}
                  max={editingSpot.totalSpots}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 (Full)</span>
                  <span>{editingSpot.totalSpots} (Empty)</span>
                </div>
              </div>

              {/* Manual Input */}
              <div className="space-y-2">
                <Label htmlFor="manual-input">Or enter manually</Label>
                <Input
                  id="manual-input"
                  type="number"
                  min={0}
                  max={editingSpot.totalSpots}
                  value={tempAvailable}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setTempAvailable(Math.max(0, Math.min(editingSpot.totalSpots, value)))
                  }}
                  className="text-center text-lg font-semibold"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setTempAvailable(0)}
                  >
                    Full
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setTempAvailable(Math.round(editingSpot.totalSpots * 0.25))}
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setTempAvailable(Math.round(editingSpot.totalSpots * 0.5))}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setTempAvailable(editingSpot.totalSpots)}
                  >
                    Empty
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium text-emerald-400">{tempAvailable}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Occupied</span>
                  <span className="font-medium text-amber-400">{editingSpot.totalSpots - tempAvailable}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-medium text-foreground">
                    {Math.round(((editingSpot.totalSpots - tempAvailable) / editingSpot.totalSpots) * 100)}%
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full" onClick={handleSaveSpot}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
