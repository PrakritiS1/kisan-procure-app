// Google Maps/OpenStreetMap integration placeholder
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function markerColor(centre) {
  if (centre.status && centre.status !== "ACTIVE") return "#9CA3AF";
  if (centre.availableCapacity <= 0) return "#DC2626";
  if (centre.availableCapacity < 30) return "#D4A017";
  return "#186B41";
}

function divIcon(color, isUser = false) {
  const size = isUser ? 16 : 26;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView({ userPosition, centres, onSelectCentre }) {
  const center = userPosition ? [userPosition.lat, userPosition.lng] : [25.37, 86.47];

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={userPosition ? [userPosition.lat, userPosition.lng] : null} />

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={divIcon("#1D4ED8", true)}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {centres.map((c) => (
        <Marker
          key={c.id}
          position={[c.latitude, c.longitude]}
          icon={divIcon(markerColor(c))}
          eventHandlers={{ click: () => onSelectCentre?.(c.id) }}
        >
          <Popup>
            <strong>{c.name}</strong>
            <br />
            {c.distanceKm.toFixed(1)} km · {c.availableCapacity} qtl available
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}