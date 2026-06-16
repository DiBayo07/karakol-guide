import { useEffect, useId, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Locate, RotateCw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

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

const userIcon = L.divIcon({
  className: 'custom-marker-user',
  html: `
    <div style="position:relative;width:18px;height:18px;">
      <div style="background:#0ea5e9;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px rgba(14,165,233,0.8);z-index:2;position:relative;"></div>
      <div style="position:absolute;top:0;left:0;width:18px;height:18px;border-radius:50%;background:#0ea5e9;opacity:0.4;animation:gps-pulse 1.8s infinite ease-out;z-index:1;"></div>
    </div>
    <style>
      @keyframes gps-pulse {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.4); opacity: 0; }
      }
    </style>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
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

function MapInner({
  markers,
  routeLine,
  zoom,
  fitBounds,
  userCoords,
  trackingMode,
  setTrackingMode,
}) {
  const linePositions = routeLine.map((p) => [p.lat, p.lng])
  const [roadPositions, setRoadPositions] = useState([])
  const map = useMap()
  const { lang } = useLanguage()

  // Handle manual map dragging/zooming to pause auto-following
  useEffect(() => {
    const handleMoveStart = () => {
      if (trackingMode === 'follow') {
        setTrackingMode('display')
      }
    }
    map.on('dragstart zoomstart', handleMoveStart)
    return () => {
      map.off('dragstart zoomstart', handleMoveStart)
    }
  }, [map, trackingMode, setTrackingMode])

  // Automatically center the map on user position when tracking is in 'follow' mode
  useEffect(() => {
    if (trackingMode === 'follow' && userCoords) {
      map.setView([userCoords.lat, userCoords.lng], map.getZoom(), { animate: true })
    }
  }, [map, userCoords, trackingMode])

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

      {/* Dynamic/Live User Location Marker */}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>
            <strong>{lang === 'en' ? 'My Live Location' : 'Моя геопозиция'}</strong>
          </Popup>
        </Marker>
      )}

      {/* Other POI markers (hiding static user marker when live coordinates are available) */}
      {markers
        .filter((m) => !(userCoords && m.poiType === 'user'))
        .map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={m.poiType === 'user' ? userIcon : m.poiType === 'food' ? foodIcon : m.poiType === 'sight' ? sightIcon : icon}
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
  const { lang } = useLanguage()

  // Live location tracking state
  const [userCoords, setUserCoords] = useState(null)
  const [trackingMode, setTrackingMode] = useState('off') // 'off', 'searching', 'follow', 'display'
  const watchIdRef = useRef(null)

  useEffect(() => {
    setReady(true)
    return () => {
      setReady(false)
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setTrackingMode('off')
    setUserCoords(null)
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? 'Geolocation is not supported by your browser' : 'Геологикация не поддерживается вашим браузером')
      return
    }

    setTrackingMode('searching')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserCoords(coords)
        setTrackingMode((prevMode) => {
          if (prevMode === 'searching') {
            return 'follow'
          }
          return prevMode
        })
      },
      (error) => {
        console.error('Error tracking location:', error)
        stopTracking()
        alert(
          lang === 'en'
            ? 'Could not retrieve your location. Please check your GPS and permissions.'
            : 'Не удалось определить местоположение. Пожалуйста, проверьте GPS и разрешения.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleLocateClick = () => {
    if (trackingMode === 'off') {
      startTracking()
    } else if (trackingMode === 'searching' || trackingMode === 'follow') {
      stopTracking()
    } else if (trackingMode === 'display') {
      setTrackingMode('follow')
    }
  }

  const mapKey = `${mapId}-${markers.length}-${routeLine.length}-${height}`

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-inner ${className}`}
      style={{ height }}
    >
      {!ready ? (
        <div className="w-full h-full bg-slate-200 animate-pulse" aria-hidden />
      ) : (
        <>
          <MapContainer
            key={mapKey}
            center={KARAKOL_CENTER}
            zoom={zoom}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', background: '#cbd5e1' }}
          >
            <MapInner
              markers={markers}
              routeLine={routeLine}
              zoom={zoom}
              fitBounds={fitBounds}
              userCoords={userCoords}
              trackingMode={trackingMode}
              setTrackingMode={setTrackingMode}
            />
          </MapContainer>

          {/* Floating Location Control Button */}
          <button
            type="button"
            onClick={handleLocateClick}
            className={`absolute bottom-4 right-4 z-[1000] flex items-center justify-center w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border)] shadow-lg transition-all active:scale-95 group cursor-pointer ${
              trackingMode === 'follow' ? 'ring-2 ring-sky-400' : ''
            }`}
            title={
              lang === 'en'
                ? trackingMode === 'off'
                  ? 'Show my location'
                  : trackingMode === 'searching'
                  ? 'Locating...'
                  : trackingMode === 'follow'
                  ? 'Follow mode active (click to stop)'
                  : 'Center on my location'
                : trackingMode === 'off'
                ? 'Показать мое местоположение'
                : trackingMode === 'searching'
                ? 'Определение геопозиции...'
                : trackingMode === 'follow'
                ? 'Режим слежения активен (нажмите, чтобы отключить)'
                : 'Вернуться к моему местоположению'
            }
          >
            {trackingMode === 'searching' ? (
              <RotateCw className="w-5 h-5 text-sky-400 animate-spin" />
            ) : (
              <Locate
                className={`w-5 h-5 transition-colors ${
                  trackingMode === 'follow'
                    ? 'text-sky-400 fill-sky-400/20'
                    : trackingMode === 'display'
                    ? 'text-sky-400'
                    : 'text-[var(--text)] group-hover:text-sky-400'
                }`}
              />
            )}
          </button>
        </>
      )}
    </div>
  )
}

export { KARAKOL_CENTER }
