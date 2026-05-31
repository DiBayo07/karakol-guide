import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const KARAKOL_CENTER = [42.4907, 78.393]

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
  html: '<div style="background:#38bdf8;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const sightIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#6366f1;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
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

export default function MapView({
  markers = [],
  routeLine = [],
  height = '400px',
  zoom = 11,
  fitBounds = false,
  className = '',
}) {
  const linePositions = routeLine.map((p) => [p.lat, p.lng])

  return (
    <div className={`rounded-2xl overflow-hidden border border-[var(--border)] ${className}`} style={{ height }}>
      <MapContainer
        center={KARAKOL_CENTER}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {fitBounds && markers.length > 0 && <FitBounds points={markers} />}
        {linePositions.length > 1 && (
          <Polyline positions={linePositions} color="#38bdf8" weight={3} opacity={0.85} dashArray="8 6" />
        )}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={m.poiType === 'food' ? foodIcon : m.poiType ? sightIcon : icon}
          >
            <Popup>
              <strong>{m.name || m.title}</strong>
              {m.address && <><br /><span style={{ fontSize: 12 }}>{m.address}</span></>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export { KARAKOL_CENTER }
