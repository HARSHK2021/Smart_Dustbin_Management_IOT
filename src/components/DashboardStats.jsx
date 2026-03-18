export default function DashboardStats({ dustbins, complaints, messages }) {
  const totalDustbins = dustbins.length;
  const fullBins = dustbins.filter(d => d.status === 'FULL').length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const totalMessages = messages.length;

  const stats = [
    {
      label: 'Total Dustbins',
      value: totalDustbins,
      icon: '🗑️',
      color: 'blue'
    },
    {
      label: 'Full Bins',
      value: fullBins,
      icon: '⚠️',
      color: 'red'
    },
    {
      label: 'Total Complaints',
      value: totalComplaints,
      icon: '📝',
      color: 'orange'
    },
    {
      label: 'Pending Complaints',
      value: pendingComplaints,
      icon: '⏳',
      color: 'yellow'
    },
    {
      label: 'Alert Messages',
      value: totalMessages,
      icon: '🔔',
      color: 'purple'
    }
  ];

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Recent Full Dustbins</h3>
        <div className="activity-list">
          {dustbins
            .filter(d => d.status === 'FULL')
            .slice(0, 5)
            .map(dustbin => (
              <div key={dustbin.id} className="activity-item">
                <span className="activity-icon">🗑️</span>
                <div className="activity-info">
                  <strong>{dustbin.id}</strong>
                  <span className="activity-meta">{dustbin.level}% full</span>
                </div>
                <span className="status-badge status-full">FULL</span>
              </div>
            ))}
          {dustbins.filter(d => d.status === 'FULL').length === 0 && (
            <p className="no-data">No full dustbins</p>
          )}
        </div>
      </div>
    </div>
  );
}
