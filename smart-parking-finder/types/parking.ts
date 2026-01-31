export type AvailabilityStatus = "high" | "medium" | "low"

export interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface ParkingSpot {
  id: string
  name: string
  address: string
  distance: string
  pricePerHour: string
  spotsAvailable: number
  totalSpots: number
  availability: AvailabilityStatus
  lat: number
  lng: number
  phone: string
  rating: number
  operatingHours: string
  reviews: Review[]
}

export interface UserLocation {
  lat: number
  lng: number
}
