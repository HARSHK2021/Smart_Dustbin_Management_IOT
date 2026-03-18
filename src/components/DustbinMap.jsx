import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerIcon = (status) => {
  const color = status === 'FULL' ? 'red' : status === 'MEDIUM' ? 'orange' : 'green';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function DustbinMap({ dustbins, userLocation, onMarkerClick }) {
  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [23.25, 77.41];

  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.divIcon({
              className: 'user-marker',
              html: '<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {dustbins.map((dustbin) => (
          <Marker
            key={dustbin.id}
            position={[dustbin.latitude, dustbin.longitude]}
            icon={getMarkerIcon(dustbin.status)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(dustbin)
            }}
          >
            <Popup>
              <div className="marker-popup">
                <h3>{dustbin.id}</h3>
                <p><strong>Fill Level:</strong> {dustbin.level}%</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${dustbin.status.toLowerCase()}`}>{dustbin.status}</span></p>
                <p><strong>Last Updated:</strong> {formatTime(dustbin.lastUpdated)}</p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onMarkerClick && onMarkerClick(dustbin)}
                >
                  Report Issue
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
