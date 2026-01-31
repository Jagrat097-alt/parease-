"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  LogOut,
  Plus,
  TrendingUp,
  IndianRupee,
  Users,
  ParkingCircle,
  Star,
  MapPin,
  Clock,
  Edit,
  MoreVertical,
  Bell,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for owner's parking spots
const ownerParkingSpots = [
  {
    id: "1",
    name: "MG Road Parking Complex",
    address: "MG Road, Near Metro Station",
    totalSpots: 120,
    occupiedSpots: 75,
    pricePerHour: 40,
    rating: 4.5,
    totalReviews: 128,
    todayRevenue: 12500,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Brigade Road Basement",
    address: "Brigade Road, Opposite Church",
    totalSpots: 80,
    occupiedSpots: 68,
    pricePerHour: 50,
    rating: 4.2,
    totalReviews: 89,
    todayRevenue: 8700,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Residency Road Multi-Level",
    address: "Residency Road, Near Kamaraj Road Junction",
    totalSpots: 200,
    occupiedSpots: 122,
    pricePerHour: 60,
    rating: 4.7,
    totalReviews: 203,
    todayRevenue: 24600,
    status: "active" as const,
  },
]

export default function OwnerDashboardPage() {
  const [parkingSpots] = useState(ownerParkingSpots)

  const totalSpots = parkingSpots.reduce((sum, spot) => sum + spot.totalSpots, 0)
  const occupiedSpots = parkingSpots.reduce((sum, spot) => sum + spot.occupiedSpots, 0)
  const todayRevenue = parkingSpots.reduce((sum, spot) => sum + spot.todayRevenue, 0)
  const avgRating = parkingSpots.reduce((sum, spot) => sum + spot.rating, 0) / parkingSpots.length

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">ParkEase</h1>
                <p className="text-xs text-muted-foreground">Owner Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, Owner!</h2>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your parking spaces
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Parking
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ParkingCircle className="h-5 w-5 text-primary" />
                </div>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalSpots}</p>
              <p className="text-xs text-muted-foreground">Total Spots</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-xs text-primary font-medium">
                  {Math.round((occupiedSpots / totalSpots) * 100)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{occupiedSpots}</p>
              <p className="text-xs text-muted-foreground">Occupied Now</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-emerald-500" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {todayRevenue.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Today&apos;s Revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Parking Spots List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Your Parking Spaces</h3>
            <Badge variant="secondary" className="text-xs">
              {parkingSpots.length} locations
            </Badge>
          </div>

          <div className="grid gap-4">
            {parkingSpots.map((spot) => {
              const occupancyRate = Math.round((spot.occupiedSpots / spot.totalSpots) * 100)
              const availableSpots = spot.totalSpots - spot.occupiedSpots

              return (
                <Card key={spot.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Main Info */}
                      <div className="flex-1 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{spot.name}</h4>
                              <Badge
                                variant="outline"
                                className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              >
                                Active
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{spot.address}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Analytics</DropdownMenuItem>
                              <DropdownMenuItem>Manage Pricing</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                            <ParkingCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Total</p>
                              <p className="text-sm font-semibold text-foreground">
                                {spot.totalSpots}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                            <Car className="h-4 w-4 text-amber-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Available</p>
                              <p className="text-sm font-semibold text-foreground">
                                {availableSpots}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                            <IndianRupee className="h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Price/Hr</p>
                              <p className="text-sm font-semibold text-foreground">
                                {spot.pricePerHour}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Rating</p>
                              <p className="text-sm font-semibold text-foreground">
                                {spot.rating} ({spot.totalReviews})
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-medium text-foreground">{occupancyRate}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                occupancyRate > 85
                                  ? "bg-red-500"
                                  : occupancyRate > 60
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Revenue Section */}
                      <div className="lg:w-48 p-4 bg-secondary/30 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-center items-center text-center">
                        <p className="text-xs text-muted-foreground mb-1">Today&apos;s Revenue</p>
                        <p className="text-2xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-5 w-5" />
                          {spot.todayRevenue.toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Updated 5 min ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Manage your parking business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <Link href="/owner/manage-spots">
                  <ParkingCircle className="h-5 w-5 text-primary" />
                  <span className="text-xs">Manage Spots</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent">
                <IndianRupee className="h-5 w-5 text-amber-500" />
                <span className="text-xs">Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-xs">Reviews</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
