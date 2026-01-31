"use client"

import { Search, SlidersHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ParkingHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ParkingHeader({ searchQuery, onSearchChange }: ParkingHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-4 safe-area-top">
      <div className="flex items-center gap-3">
        {/* Menu Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border shrink-0"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/owner/login" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Owner Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/owner/register" className="flex items-center gap-2 cursor-pointer">
                Register as Owner
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search parking near you..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 pl-12 pr-4 rounded-full bg-card/90 backdrop-blur-sm border-border shadow-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border shrink-0"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Filters</span>
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="text-xs text-muted-foreground">Limited</span>
        </div>
        <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Full</span>
        </div>
      </div>
    </header>
  )
}
