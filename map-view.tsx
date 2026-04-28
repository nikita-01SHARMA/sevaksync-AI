"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mapLocations } from "@/lib/data"
import { MapPin } from "lucide-react"

export function MapView() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Card className="h-[500px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Ahmedabad Coverage Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </CardContent>
      </Card>
    )
  }

  return <MapContent />
}

function MapContent() {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<{ center: [number, number]; zoom: number; className: string; children: React.ReactNode }>
    TileLayer: React.ComponentType<{ attribution: string; url: string }>
    Marker: React.ComponentType<{ position: [number, number]; children?: React.ReactNode }>
    Popup: React.ComponentType<{ children: React.ReactNode }>
  } | null>(null)

  useEffect(() => {
    // Dynamic import for Leaflet (client-side only)
    const loadMap = async () => {
      const L = await import("leaflet")
      const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet")
      
      // Import CSS
      await import("leaflet/dist/leaflet.css")
      
      // Fix marker icons
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
      
      setMapComponents({ 
        MapContainer: MapContainer as unknown as React.ComponentType<{ center: [number, number]; zoom: number; className: string; children: React.ReactNode }>,
        TileLayer: TileLayer as unknown as React.ComponentType<{ attribution: string; url: string }>,
        Marker: Marker as unknown as React.ComponentType<{ position: [number, number]; children?: React.ReactNode }>,
        Popup: Popup as unknown as React.ComponentType<{ children: React.ReactNode }>
      })
    }
    
    loadMap()
  }, [])

  if (!MapComponents) {
    return (
      <Card className="h-[500px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Ahmedabad Coverage Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </CardContent>
      </Card>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Ahmedabad Coverage Map
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[420px] p-0 px-6 pb-6">
        <div className="h-full w-full overflow-hidden rounded-lg border">
          <MapContainer
            center={[23.0225, 72.5714]}
            zoom={11}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapLocations.map((location) => (
              <Marker key={location.name} position={[location.lat, location.lng]}>
                <Popup>
                  <div className="min-w-[150px]">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm">Needs: {location.needs}</p>
                    <p className="text-sm">Volunteers: {location.volunteers}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
