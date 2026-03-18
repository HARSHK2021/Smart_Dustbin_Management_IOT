export default function AdminSidebar({ activeTab, onTabChange, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'dustbins', label: 'Dustbins', icon: '🗑️' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'messages', label: 'Messages', icon: '🔔' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-danger btn-block" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
