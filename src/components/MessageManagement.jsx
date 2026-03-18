export default function MessageManagement({ messages }) {
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
          </div>
        ))}

        {messages.length === 0 && (
          <div className="no-data">No alert messages</div>
        )}
      </div>
    </div>
  );
}
