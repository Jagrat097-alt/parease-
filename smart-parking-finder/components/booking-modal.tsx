"use client"

import { useState } from "react"
import {
  X,
  Calendar,
  Clock,
  IndianRupee,
  Car,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ParkingSpot } from "@/types/parking"

interface BookingModalProps {
  spot: ParkingSpot
  isOpen: boolean
  onClose: () => void
}

type BookingStep = "select" | "confirm" | "success"

export function BookingModal({ spot, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("select")
  const [hours, setHours] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  )
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Extract price number from string (e.g., "₹40" -> 40)
  const pricePerHour = parseInt(spot.pricePerHour.replace(/[^\d]/g, ""))
  const totalPrice = pricePerHour * hours

  const handleIncreaseHours = () => {
    if (hours < 24) setHours(hours + 1)
  }

  const handleDecreaseHours = () => {
    if (hours > 1) setHours(hours - 1)
  }

  const handleConfirmBooking = () => {
    setIsProcessing(true)
    // Simulate booking process
    setTimeout(() => {
      setIsProcessing(false)
      setStep("success")
    }, 1500)
  }

  const handleClose = () => {
    setStep("select")
    setHours(1)
    setVehicleNumber("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-4 bottom-4 bg-card border border-border rounded-2xl z-50 max-w-md mx-auto overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {step === "success" ? "Booking Confirmed" : "Book Parking Spot"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {step === "select" && (
            <div className="space-y-5">
              {/* Parking Info */}
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{spot.name}</h3>
                  <p className="text-sm text-muted-foreground">{spot.address}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Duration (Hours)
                </label>
                <div className="flex items-center justify-between bg-secondary rounded-xl p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecreaseHours}
                    disabled={hours <= 1}
                    className="h-10 w-10 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{hours}</span>
                    <span className="text-muted-foreground">
                      {hours === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncreaseHours}
                    disabled={hours >= 24}
                    className="h-10 w-10 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., KA 01 AB 1234"
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Price Summary */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xs text-muted-foreground">
                    {spot.pricePerHour} x {hours} {hours === 1 ? "hour" : "hours"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <IndianRupee className="h-5 w-5" />
                  {totalPrice}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                className="w-full h-12 text-base font-medium"
                onClick={() => setStep("confirm")}
                disabled={!vehicleNumber.trim()}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-5">
              {/* Booking Summary */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Booking Summary</h3>
                
                <div className="bg-secondary rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parking</span>
                    <span className="font-medium text-foreground">{spot.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">
                      {new Date(selectedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">
                      {hours} {hours === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-medium text-foreground">{vehicleNumber}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-primary flex items-center gap-0.5">
                      <IndianRupee className="h-4 w-4" />
                      {totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["UPI", "Card", "Wallet", "Cash"].map((method) => (
                    <button
                      key={method}
                      className="p-3 bg-secondary rounded-xl text-sm font-medium text-foreground border-2 border-transparent hover:border-primary focus:border-primary transition-colors"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 h-12"
                  onClick={() => setStep("select")}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-12"
                  onClick={handleConfirmBooking}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-5">
              {/* Success Icon */}
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Booking Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your parking spot has been reserved
                </p>
              </div>

              {/* Booking Details Card */}
              <div className="bg-secondary rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono font-medium text-foreground">
                    PE{Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{spot.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium text-foreground">{vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-primary flex items-center gap-0.5">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {totalPrice}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                A confirmation has been sent to your phone
              </p>

              <Button className="w-full h-12" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
