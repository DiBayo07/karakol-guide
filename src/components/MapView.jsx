import { useEffect, useId, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const KARAKOL_CENTER = [42.4907, 78.393]

const SATELLITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const LABELS_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const foodIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#38bdf8;width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.5)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const sightIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#fbbf24;width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.5)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (!points?.length) return
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
  }, [map, points])
  return null
}

function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 150)
    return () => clearTimeout(id)
  }, [map])
  return null
}

function MapInner({ markers, routeLine, zoom, fitBounds }) {
  const linePositions = routeLine.map((p) => [p.lat, p.lng])
  const [roadPositions, setRoadPositions] = useState([])

  useEffect(() => {
    if (routeLine.length < 2) {
      setRoadPositions([])
      return
    }

    let active = true
    const fetchRoute = async () => {
      try {
        const coordsStr = routeLine.map((p) => `${p.lng},${p.lat}`).join(';')
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsStr}?geometries=geojson&overview=full`
        )
        const data = await response.json()
        if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates && active) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
          setRoadPositions(coords)
        } else if (active) {
          setRoadPositions(linePositions)
        }
      } catch (err) {
        console.error('OSRM route fetch failed:', err)
        if (active) {
          setRoadPositions(linePositions)
        }
      }
    }

    fetchRoute()
    return () => {
      active = false
    }
  }, [routeLine])

  return (
    <>
      <TileLayer
        attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        url={SATELLITE_URL}
        maxZoom={19}
      />
      <TileLayer url={LABELS_URL} maxZoom={19} opacity={0.85} />
      <MapResizeFix />
      {fitBounds && markers.length > 0 && <FitBounds points={markers} />}
      {roadPositions.length > 1 ? (
        <Polyline positions={roadPositions} color="#38bdf8" weight={5} opacity={0.9} lineJoin="round" lineCap="round" />
      ) : linePositions.length > 1 ? (
        <Polyline positions={linePositions} color="#fbbf24" weight={4} opacity={0.7} dashArray="5, 10" />
      ) : null}
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={m.poiType === 'food' ? foodIcon : m.poiType ? sightIcon : icon}
        >
          <Popup>
            <strong>{m.name || m.title}</strong>
            {m.address && (
              <>
                <br />
                <span style={{ fontSize: 12 }}>{m.address}</span>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function MapView({
  markers = [],
  routeLine = [],
  height = '400px',
  zoom = 11,
  fitBounds = false,
  className = '',
}) {
  const mapId = useId()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    return () => setReady(false)
  }, [])

  const mapKey = `${mapId}-${markers.length}-${routeLine.length}-${height}`

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-[var(--border)] shadow-inner ${className}`}
      style={{ height }}
    >
      {!ready ? (
        <div className="w-full h-full bg-slate-200 animate-pulse" aria-hidden />
      ) : (
        <MapContainer
          key={mapKey}
          center={KARAKOL_CENTER}
          zoom={zoom}
          scrollWheelZoom
          style={{ height: '100%', width: '100%', background: '#cbd5e1' }}
        >
          <MapInner markers={markers} routeLine={routeLine} zoom={zoom} fitBounds={fitBounds} />
        </MapContainer>
      )}
    </div>
  )
}

export { KARAKOL_CENTER }
