import { useState, useEffect } from 'react';
import DustbinMap from '../components/DustbinMap';
import DustbinCard from '../components/DustbinCard';
import ComplaintModal from '../components/ComplaintModal';
import { dustbinAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { useGeolocation } from '../hooks/useGeolocation';

export default function Home() {
  const [dustbins, setDustbins] = useState([]);
  const [filteredDustbins, setFilteredDustbins] = useState([]);
  const [selectedDustbin, setSelectedDustbin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { location: userLocation } = useGeolocation();

  useEffect(() => {
    loadDustbins();

    const socket = getSocket();

    socket.on('dustbinUpdate', (updatedDustbin) => {
      setDustbins(prev => {
        const index = prev.findIndex(d => d.id === updatedDustbin.id);
        if (index >= 0) {
          const newDustbins = [...prev];
          newDustbins[index] = updatedDustbin;
          return newDustbins;
        }
        return [...prev, updatedDustbin];
      });
    });

    socket.on('dustbinAdded', (newDustbin) => {
      setDustbins(prev => [...prev, newDustbin]);
    });

    socket.on('dustbinDeleted', (deletedId) => {
      setDustbins(prev => prev.filter(d => d.id !== deletedId));
    });

    return () => {
      socket.off('dustbinUpdate');
      socket.off('dustbinAdded');
      socket.off('dustbinDeleted');
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = dustbins.filter(d =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDustbins(filtered);
    } else {
      setFilteredDustbins(dustbins);
    }
  }, [searchTerm, dustbins]);

  const loadDustbins = async () => {
    try {
      const data = await dustbinAPI.getAll();
      setDustbins(data);
    } catch (error) {
      console.error('Error loading dustbins:', error);
    }
  };

  const handleReportClick = (dustbin) => {
    setSelectedDustbin(dustbin);
    setShowModal(true);
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Smart Dustbin Monitoring System</h1>
        <p>Track and manage waste collection in real-time</p>
      </header>

      <div className="map-section">
        <DustbinMap
          dustbins={dustbins}
          userLocation={userLocation}
          onMarkerClick={handleReportClick}
        />
      </div>

      <div className="dustbins-section">
        <div className="section-header">
          <h2>All Dustbins</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="dustbins-grid">
          {filteredDustbins.map(dustbin => (
            <DustbinCard
              key={dustbin.id}
              dustbin={dustbin}
              userLocation={userLocation}
              onReportClick={handleReportClick}
            />
          ))}
        </div>

        {filteredDustbins.length === 0 && (
          <div className="no-results">
            <p>No dustbins found</p>
          </div>
        )}
      </div>

      {showModal && selectedDustbin && (
        <ComplaintModal
          dustbin={selectedDustbin}
          onClose={() => setShowModal(false)}
          onSuccess={loadDustbins}
        />
      )}
    </div>
  );
}
