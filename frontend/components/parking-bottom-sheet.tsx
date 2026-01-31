"use client"

import { useRef, useState, useEffect } from "react"
import {
  X,
  Phone,
  Navigation,
  Car,
  Clock,
  MapPin,
  IndianRupee,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User,
  Ticket,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookingModal } from "@/components/booking-modal"
import type { ParkingSpot, Review } from "@/types/parking"

interface ParkingBottomSheetProps {
  spot: ParkingSpot | null
  onClose: () => void
  userLocation: { lat: number; lng: number } | null
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className={cn(iconSize, "fill-amber-400 text-amber-400")} />
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={cn(iconSize, "text-muted")} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(iconSize, "fill-amber-400 text-amber-400")} />
          </div>
        </div>
      )
    } else {
      stars.push(<Star key={i} className={cn(iconSize, "text-muted")} />)
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={review.rating} />
          <span className="text-xs text-muted-foreground ml-1">{review.rating}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </div>
  )
}

export function ParkingBottomSheet({ spot, onClose, userLocation }: ParkingBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    if (spot) {
      setIsVisible(true)
      setShowReviews(false)
      setIsExpanded(false)
      setShowBooking(false)
    } else {
      setIsVisible(false)
    }
  }, [spot])

  const getStatusColor = () => {
    switch (spot?.availability) {
      case "high":
        return "bg-emerald-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  const getStatusText = () => {
    switch (spot?.availability) {
      case "high":
        return "Many spots available"
      case "medium":
        return "Limited availability"
      case "low":
        return "Almost full"
      default:
        return "Unknown"
    }
  }

  const handleCall = () => {
    if (spot?.phone) {
      window.open(`tel:${spot.phone}`, "_self")
    }
  }

  const handleNavigate = () => {
    if (spot) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
      window.open(url, "_blank")
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setShowReviews(true)
    }
  }

  if (!spot) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity duration-300 z-40",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl z-50",
          "transition-all duration-300 ease-out overflow-hidden",
          isVisible ? "translate-y-0" : "translate-y-full",
          isExpanded ? "max-h-[85vh]" : "max-h-[55vh]"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card z-10">
          <div className="h-1 w-12 rounded-full bg-muted" />
        </div>

        {/* Scrollable Content */}
        <div className={cn("px-5 pb-8 overflow-y-auto", isExpanded ? "max-h-[75vh]" : "max-h-[45vh]")}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-foreground">{spot.name}</h2>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={spot.rating} size="md" />
                <span className="text-sm font-medium text-amber-400">{spot.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({spot.reviews.length} reviews)
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {spot.address}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full -mt-1 -mr-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Navigation className="h-4 w-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">{spot.distance}</p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>

            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <IndianRupee className="h-4 w-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">{spot.pricePerHour}</p>
              <p className="text-xs text-muted-foreground">Per hour</p>
            </div>

            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Car className="h-4 w-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">{spot.spotsAvailable}</p>
              <p className="text-xs text-muted-foreground">Spots free</p>
            </div>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-secondary/50">
            <div className={cn("h-3 w-3 rounded-full", getStatusColor())} />
            <span className="text-sm text-foreground">{getStatusText()}</span>
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {spot.operatingHours}
            </span>
          </div>

          {/* Reviews Section */}
          <div className="mb-5">
            <button
              onClick={toggleExpand}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Reviews & Comments
                </span>
                <span className="text-xs text-muted-foreground">
                  ({spot.reviews.length})
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Reviews List */}
            {showReviews && (
              <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
                {spot.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                
                {spot.reviews.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sticky bottom-0 bg-card pt-2">
            {/* Book Now Button - Primary Action */}
            <Button
              className="w-full h-12 text-base font-medium gap-2"
              onClick={() => setShowBooking(true)}
            >
              <Ticket className="h-5 w-5" />
              Book Now - {spot.pricePerHour}/hr
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="secondary"
                className="flex flex-col h-auto py-3 gap-1.5"
                onClick={handleCall}
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">Call</span>
              </Button>

              <Button
                variant="secondary"
                className="flex flex-col h-auto py-3 gap-1.5"
                onClick={toggleExpand}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Reviews</span>
              </Button>

              <Button
                variant="secondary"
                className="flex flex-col h-auto py-3 gap-1.5"
                onClick={handleNavigate}
              >
                <Navigation className="h-5 w-5" />
                <span className="text-xs">Navigate</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          spot={spot}
          isOpen={showBooking}
          onClose={() => setShowBooking(false)}
        />
      </div>
    </>
  )
}
