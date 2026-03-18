export default function DustbinCard({ dustbin, onReportClick, userLocation }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const distance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, dustbin.latitude, dustbin.longitude)
    : null;

  return (
    <div className="dustbin-card">
      <div className="card-header">
        <h3>{dustbin.id}</h3>
        <span className={`status-badge status-${dustbin.status.toLowerCase()}`}>
          {dustbin.status}
        </span>
      </div>

      <div className="card-body">
        <div className="progress-container">
          <div className="progress-label">
            <span>Fill Level</span>
            <span className="progress-value">{dustbin.level}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill progress-${dustbin.status.toLowerCase()}`}
              style={{ width: `${dustbin.level}%` }}
            />
          </div>
        </div>

        <div className="card-info">
          <p><strong>Location:</strong> {dustbin.latitude.toFixed(4)}, {dustbin.longitude.toFixed(4)}</p>
          {distance && <p><strong>Distance:</strong> {distance} km</p>}
          <p><strong>Last Updated:</strong> {formatTime(dustbin.lastUpdated)}</p>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={() => onReportClick(dustbin)}
        >
          Report Issue
        </button>
      </div>
    </div>
  );
}
