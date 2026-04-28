"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Car, 
  Bike, 
  PersonStanding,
  Locate,
  Route,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { volunteers, mapLocations, type Volunteer } from "@/lib/data"

interface DistanceCalculatorProps {
  isOpen: boolean
  onClose: () => void
  selectedVolunteer?: Volunteer | null
  needLocation?: string
}

interface LocationCoords {
  lat: number
  lng: number
  name: string
}

// Ahmedabad area coordinates
const areaCoordinates: Record<string, LocationCoords> = {
  "Naroda": { lat: 23.0707, lng: 72.6516, name: "Naroda" },
  "Maninagar": { lat: 22.9958, lng: 72.6141, name: "Maninagar" },
  "Bopal": { lat: 23.0313, lng: 72.4682, name: "Bopal" },
  "Chandkheda": { lat: 23.1104, lng: 72.5847, name: "Chandkheda" },
  "Custom": { lat: 23.0225, lng: 72.5714, name: "Custom Location" },
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Estimate travel time based on mode
function estimateTravelTime(distanceKm: number, mode: "walking" | "bike" | "car"): number {
  const speeds = {
    walking: 5, // 5 km/h
    bike: 15,   // 15 km/h  
    car: 30,    // 30 km/h (accounting for traffic)
  }
  return (distanceKm / speeds[mode]) * 60 // Return in minutes
}

export function DistanceCalculator({ 
  isOpen, 
  onClose, 
  selectedVolunteer,
  needLocation 
}: DistanceCalculatorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<{ center: [number, number]; zoom: number; className: string; children: React.ReactNode; ref?: React.Ref<unknown> }>
    TileLayer: React.ComponentType<{ attribution: string; url: string }>
    Marker: React.ComponentType<{ position: [number, number]; children?: React.ReactNode; icon?: unknown; eventHandlers?: Record<string, () => void> }>
    Popup: React.ComponentType<{ children: React.ReactNode }>
    Polyline: React.ComponentType<{ positions: [number, number][]; color: string; weight: number; dashArray?: string }>
    useMapEvents: (handlers: { click?: (e: { latlng: { lat: number; lng: number } }) => void }) => void
  } | null>(null)
  const [L, setL] = useState<typeof import("leaflet") | null>(null)
  
  const [volunteerLocation, setVolunteerLocation] = useState<LocationCoords | null>(null)
  const [destination, setDestination] = useState<LocationCoords | null>(null)
  const [customMarker, setCustomMarker] = useState<LocationCoords | null>(null)
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [travelMode, setTravelMode] = useState<"walking" | "bike" | "car">("car")
  const [isSelectingOnMap, setIsSelectingOnMap] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Load Leaflet
    const loadMap = async () => {
      const leaflet = await import("leaflet")
      const { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } = await import("react-leaflet")
      await import("leaflet/dist/leaflet.css")
      
      delete (leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
      
      setL(leaflet)
      setMapComponents({
        MapContainer: MapContainer as unknown as React.ComponentType<{ center: [number, number]; zoom: number; className: string; children: React.ReactNode; ref?: React.Ref<unknown> }>,
        TileLayer: TileLayer as unknown as React.ComponentType<{ attribution: string; url: string }>,
        Marker: Marker as unknown as React.ComponentType<{ position: [number, number]; children?: React.ReactNode; icon?: unknown; eventHandlers?: Record<string, () => void> }>,
        Popup: Popup as unknown as React.ComponentType<{ children: React.ReactNode }>,
        Polyline: Polyline as unknown as React.ComponentType<{ positions: [number, number][]; color: string; weight: number; dashArray?: string }>,
        useMapEvents: useMapEvents as (handlers: { click?: (e: { latlng: { lat: number; lng: number } }) => void }) => void,
      })
    }
    
    loadMap()
  }, [])

  // Set volunteer location when selected
  useEffect(() => {
    if (selectedVolunteer) {
      const coords = areaCoordinates[selectedVolunteer.area]
      if (coords) {
        setVolunteerLocation(coords)
      }
    }
  }, [selectedVolunteer])

  // Set destination when need location provided
  useEffect(() => {
    if (needLocation && areaCoordinates[needLocation]) {
      setDestination(areaCoordinates[needLocation])
      setSelectedArea(needLocation)
    }
  }, [needLocation])

  const handleAreaChange = (area: string) => {
    setSelectedArea(area)
    if (area === "custom") {
      setIsSelectingOnMap(true)
      toast.info("Click on the map to select destination")
    } else if (areaCoordinates[area]) {
      setDestination(areaCoordinates[area])
      setCustomMarker(null)
      setIsSelectingOnMap(false)
    }
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (isSelectingOnMap) {
      const customLocation: LocationCoords = {
        lat,
        lng,
        name: `Custom (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      }
      setCustomMarker(customLocation)
      setDestination(customLocation)
      setIsSelectingOnMap(false)
      toast.success("Destination set!")
    }
  }, [isSelectingOnMap])

  const distance = volunteerLocation && destination
    ? calculateDistance(volunteerLocation.lat, volunteerLocation.lng, destination.lat, destination.lng)
    : null

  const travelTime = distance ? estimateTravelTime(distance, travelMode) : null

  // Map click handler component
  function MapClickHandler() {
    if (!MapComponents) return null
    MapComponents.useMapEvents({
      click: (e) => {
        handleMapClick(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }

  // Custom icons
  const volunteerIcon = L ? new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }) : undefined

  const destinationIcon = L ? new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }) : undefined

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Distance & Travel Time Calculator
          </DialogTitle>
          <DialogDescription>
            Select a destination to calculate distance and estimated arrival time
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Controls */}
          <div className="space-y-4">
            {/* Volunteer Info */}
            {selectedVolunteer && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    Volunteer Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">{selectedVolunteer.name}</p>
                  <p className="text-muted-foreground">{selectedVolunteer.area}</p>
                </CardContent>
              </Card>
            )}

            {/* Destination Selection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="area-select">Select Area</Label>
                  <Select value={selectedArea} onValueChange={handleAreaChange}>
                    <SelectTrigger id="area-select">
                      <SelectValue placeholder="Choose destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(areaCoordinates).filter(a => a !== "Custom").map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Location (Click on Map)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {isSelectingOnMap && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <Locate className="h-4 w-4 animate-pulse" />
                    Click on the map to select
                  </div>
                )}
                
                {customMarker && (
                  <div className="text-sm text-muted-foreground">
                    <p>Selected: {customMarker.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Travel Mode */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Travel Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={travelMode === "walking" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTravelMode("walking")}
                    className="flex-1"
                  >
                    <PersonStanding className="h-4 w-4 mr-1" />
                    Walk
                  </Button>
                  <Button
                    variant={travelMode === "bike" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTravelMode("bike")}
                    className="flex-1"
                  >
                    <Bike className="h-4 w-4 mr-1" />
                    Bike
                  </Button>
                  <Button
                    variant={travelMode === "car" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTravelMode("car")}
                    className="flex-1"
                  >
                    <Car className="h-4 w-4 mr-1" />
                    Car
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {distance !== null && travelTime !== null && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Calculated Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Distance</span>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {distance.toFixed(1)} km
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Est. Time</span>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {travelTime < 60 
                        ? `${Math.round(travelTime)} min`
                        : `${Math.floor(travelTime / 60)}h ${Math.round(travelTime % 60)}m`
                      }
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    * Estimated based on average {travelMode} speed. Actual time may vary.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[400px] rounded-lg border overflow-hidden">
            {!isMounted || !MapComponents ? (
              <div className="h-full flex items-center justify-center bg-muted/30">
                <div className="text-muted-foreground">Loading map...</div>
              </div>
            ) : (
              <MapComponents.MapContainer
                center={[23.0225, 72.5714]}
                zoom={11}
                className="h-full w-full"
              >
                <MapComponents.TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapClickHandler />
                
                {/* Volunteer Marker */}
                {volunteerLocation && volunteerIcon && (
                  <MapComponents.Marker 
                    position={[volunteerLocation.lat, volunteerLocation.lng]}
                    icon={volunteerIcon}
                  >
                    <MapComponents.Popup>
                      <div className="min-w-[120px]">
                        <p className="font-semibold text-blue-600">Volunteer</p>
                        <p className="text-sm">{selectedVolunteer?.name}</p>
                        <p className="text-xs text-gray-500">{volunteerLocation.name}</p>
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                )}
                
                {/* Destination Marker */}
                {destination && destinationIcon && (
                  <MapComponents.Marker 
                    position={[destination.lat, destination.lng]}
                    icon={destinationIcon}
                  >
                    <MapComponents.Popup>
                      <div className="min-w-[120px]">
                        <p className="font-semibold text-red-600">Destination</p>
                        <p className="text-sm">{destination.name}</p>
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                )}

                {/* Route Line */}
                {volunteerLocation && destination && (
                  <MapComponents.Polyline
                    positions={[
                      [volunteerLocation.lat, volunteerLocation.lng],
                      [destination.lat, destination.lng]
                    ]}
                    color="#3b82f6"
                    weight={3}
                    dashArray="10, 10"
                  />
                )}

                {/* Area Markers */}
                {mapLocations.map((location) => (
                  <MapComponents.Marker 
                    key={location.name} 
                    position={[location.lat, location.lng]}
                    eventHandlers={{
                      click: () => {
                        if (isSelectingOnMap) {
                          handleMapClick(location.lat, location.lng)
                        }
                      }
                    }}
                  >
                    <MapComponents.Popup>
                      <div className="min-w-[120px]">
                        <p className="font-semibold">{location.name}</p>
                        <p className="text-sm">Needs: {location.needs}</p>
                        <p className="text-sm">Volunteers: {location.volunteers}</p>
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                ))}
              </MapComponents.MapContainer>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Volunteer Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-blue-500" style={{ borderStyle: "dashed" }} />
            <span>Route</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
