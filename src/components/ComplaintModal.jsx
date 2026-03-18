import { useState } from 'react';
import { complaintAPI } from '../services/api';

export default function ComplaintModal({ dustbin, onClose, onSuccess }) {
  const [issue, setIssue] = useState('Full');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      await complaintAPI.create({
        dustbinId: dustbin.id,
        issue,
        description
      });
      alert('Complaint submitted successfully!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Issue</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Dustbin ID</label>
            <input
              type="text"
              value={dustbin.id}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Issue Type</label>
            <select
              className="form-control"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >
              <option value="Full">Full</option>
              <option value="Overflowing">Overflowing</option>
              <option value="Not Collected">Not Collected</option>
              <option value="Broken">Broken</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
