import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ messages, onSendMessage, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 65, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid #333333'
    }}>
      {/* Chat header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        borderBottom: '1px solid #333333',
        background: '#0f0f0f',
        borderRadius: '12px 12px 0 0'
      }}>
        <h3 style={{ margin: 0, color: '#00ff41', textShadow: '0 0 10px rgba(0, 255, 65, 0.5)' }}>Chat</h3>
                  <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#00ff41',
              padding: '4px',
              textShadow: '0 0 5px rgba(0, 255, 65, 0.5)'
            }}
          >
            ✕
          </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        maxHeight: '400px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#cccccc',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>💬</div>
            <p>No messages yet</p>
            <p style={{ fontSize: '14px' }}>Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
                          <div
                key={message.id}
                style={{
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  borderRadius: '8px',
                  maxWidth: '100%',
                  border: '1px solid #333333'
                }}
              >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: '#00ff41',
                  fontSize: '14px',
                  textShadow: '0 0 5px rgba(0, 255, 65, 0.3)'
                }}>
                  {message.sender}
                </span>
                <span style={{
                  color: '#cccccc',
                  fontSize: '12px'
                }}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
                              <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  wordBreak: 'break-word'
                }}>
                  {message.text}
                </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '16px',
        borderTop: '1px solid #333333'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
                      <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '2px solid #333333',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#1a1a1a',
                color: '#ffffff'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            />
                      <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                padding: '8px 16px',
                background: newMessage.trim() ? '#00ff41' : '#333333',
                color: newMessage.trim() ? '#000000' : '#666666',
                border: 'none',
                borderRadius: '6px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: newMessage.trim() ? '0 0 10px rgba(0, 255, 65, 0.5)' : 'none',
                textShadow: newMessage.trim() ? '0 0 5px rgba(0, 255, 65, 0.3)' : 'none'
              }}
            >
              Send
            </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 