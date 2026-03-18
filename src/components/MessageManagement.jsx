import { useState } from 'react';
import { messageAPI } from '../services/api';

export default function MessageManagement({ messages, onRefresh, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (messageId) => {
    if (!confirm('Delete this message?')) return;
    setDeletingId(messageId);
    try {
      const res = await messageAPI.deleteById(messageId);
      if (!res?.success) {
        throw new Error(res?.message || 'Delete failed');
      }
      onDelete?.(messageId);
      onRefresh?.();
    } catch (e) {
      console.error('Error deleting message:', e);
      alert('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="message-management">
      <div className="messages-list">
        {messages.map(message => (
          <div key={message.messageId} className="message-card">
            <div className="message-header">
              <span className="message-type">{message.type}</span>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="message-body">
              <p>{message.text}</p>
              <span className="message-dustbin">Dustbin: {message.dustbinId}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(message.messageId)}
                disabled={deletingId === message.messageId}
              >
                {deletingId === message.messageId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="no-data">No alert messages</div>
        )}
      </div>
    </div>
  );
}
