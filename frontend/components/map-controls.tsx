"use client"

import { Plus, Minus, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onRecenter: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onRecenter }: MapControlsProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomIn}
        className="h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border hover:bg-card"
      >
        <Plus className="h-5 w-5" />
        <span className="sr-only">Zoom in</span>
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomOut}
        className="h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border hover:bg-card"
      >
        <Minus className="h-5 w-5" />
        <span className="sr-only">Zoom out</span>
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={onRecenter}
        className="h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border hover:bg-card mt-2"
      >
        <Locate className="h-5 w-5 text-primary" />
        <span className="sr-only">Recenter map</span>
      </Button>
    </div>
  )
}
