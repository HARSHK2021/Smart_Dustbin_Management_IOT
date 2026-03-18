import { complaintAPI } from '../services/api';

export default function ComplaintManagement({ complaints, onRefresh }) {
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateStatus(complaintId, newStatus);
      alert('Complaint status updated!');
      onRefresh();
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint status');
    }
  };

  return (
    <div className="complaint-management">
      <div className="complaints-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Dustbin ID</th>
              <th>Issue Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(complaint => (
              <tr key={complaint.complaintId}>
                <td>{complaint.complaintId}</td>
                <td>{complaint.dustbinId}</td>
                <td>
                  <span className="issue-badge">{complaint.issue}</span>
                </td>
                <td className="description-cell">{complaint.description}</td>
                <td>
                  <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </td>
                <td>{new Date(complaint.timestamp).toLocaleString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint.complaintId, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <div className="no-data">No complaints found</div>
        )}
      </div>
    </div>
  );
}
