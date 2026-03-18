import { useEffect, useState, useRef } from 'react';
import { dustbinAPI } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../hooks/useGeolocation';

export default function DustbinManagement({ dustbins, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [usingLiveLocation, setUsingLiveLocation] = useState(false);
  const mapRef = useRef(null);
  const { location: adminLocation } = useGeolocation();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !adminLocation) return;

    map.setView([adminLocation.latitude, adminLocation.longitude], 14, { animate: true, duration: 0.6 });
  }, [adminLocation]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dustbinAPI.add({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
      alert('Dustbin added successfully!');
      setLatitude('');
      setLongitude('');
      setShowAddForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error adding dustbin:', error);
      alert('Failed to add dustbin');
    } finally {
      setLoading(false);
    }
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setUsingLiveLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setUsingLiveLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to fetch your live location. Please allow location access or enter coordinates manually.');
        setUsingLiveLocation(false);
      }
    );
  };

  const focusOnDustbin = (dustbin) => {
    const lat = Number(dustbin?.latitude);
    const lng = Number(dustbin?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const map = mapRef.current;
    if (map) {
      map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true, duration: 0.6 });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete dustbin ${id}?`)) {
      return;
    }

    try {
      await dustbinAPI.delete(id);
      alert('Dustbin deleted successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error deleting dustbin:', error);
      alert('Failed to delete dustbin');
    }
  };

  return (
    <div className="dustbin-management">
      <div className="management-header">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Dustbin'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-card">
          <h3>Add New Dustbin</h3>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 23.25"
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., 77.41"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleUseLiveLocation}
                disabled={usingLiveLocation}
              >
                {usingLiveLocation ? 'Fetching live location...' : 'Use live location'}
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Dustbin'}
            </button>
          </form>
        </div>
      )}

      <div className="map-view">
        <h3>Dustbin Locations</h3>
        <div className="map-container-admin">
          <MapContainer
            center={[
              adminLocation?.latitude ?? 23.25,
              adminLocation?.longitude ?? 77.41
            ]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {dustbins.map(dustbin => (
              <Marker
                key={dustbin.id}
                position={[dustbin.latitude, dustbin.longitude]}
                eventHandlers={{
                  click: () => focusOnDustbin(dustbin),
                }}
              >
                <Popup>
                  <strong>{dustbin.id}</strong><br />
                  Status: {dustbin.status}<br />
                  Level: {dustbin.level}%
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="dustbin-table">
        <h3>All Dustbins</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Fill Level</th>
              <th>Location</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dustbins.map(dustbin => (
              <tr
                key={dustbin.id}
                className="clickable-row"
                onClick={() => focusOnDustbin(dustbin)}
              >
                <td>{dustbin.id}</td>
                <td>
                  <span className={`status-badge status-${dustbin.status.toLowerCase()}`}>
                    {dustbin.status}
                  </span>
                </td>
                <td>{dustbin.level}%</td>
                <td>{dustbin.latitude.toFixed(4)}, {dustbin.longitude.toFixed(4)}</td>
                <td>{new Date(dustbin.lastUpdated).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusOnDustbin(dustbin);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    View on map
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dustbin.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
