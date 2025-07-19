import React from 'react';

const Controls = ({ 
  isAudioMuted, 
  isVideoOff, 
  onToggleAudio, 
  onToggleVideo, 
  onToggleChat, 
  isChatOpen,
  disabled = false
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 65, 0.1)',
      border: '1px solid #333333'
    }}>
      {/* Audio control */}
      <button
        className="btn"
        style={{
          background: disabled ? '#333333' : (isAudioMuted ? '#ff0040' : '#00ff41'),
          color: disabled ? '#666666' : (isAudioMuted ? '#ffffff' : '#000000'),
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1,
          boxShadow: disabled ? 'none' : (isAudioMuted ? '0 0 15px rgba(255, 0, 64, 0.6)' : '0 0 15px rgba(0, 255, 65, 0.6)'),
          textShadow: disabled ? 'none' : (isAudioMuted ? '0 0 5px rgba(255, 0, 64, 0.3)' : '0 0 5px rgba(0, 255, 65, 0.3)')
        }}
        onClick={disabled ? undefined : onToggleAudio}
        title={disabled ? 'Audio not available' : (isAudioMuted ? 'Unmute' : 'Mute')}
        disabled={disabled}
      >
        {isAudioMuted ? '🔇' : '🎤'}
      </button>

      {/* Video control */}
      <button
        className="btn"
        style={{
          background: disabled ? '#333333' : (isVideoOff ? '#ff0040' : '#00ff41'),
          color: disabled ? '#666666' : (isVideoOff ? '#ffffff' : '#000000'),
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1,
          boxShadow: disabled ? 'none' : (isVideoOff ? '0 0 15px rgba(255, 0, 64, 0.6)' : '0 0 15px rgba(0, 255, 65, 0.6)'),
          textShadow: disabled ? 'none' : (isVideoOff ? '0 0 5px rgba(255, 0, 64, 0.3)' : '0 0 5px rgba(0, 255, 65, 0.3)')
        }}
        onClick={disabled ? undefined : onToggleVideo}
        title={disabled ? 'Video not available' : (isVideoOff ? 'Turn on camera' : 'Turn off camera')}
        disabled={disabled}
      >
        {isVideoOff ? '📹' : '📷'}
      </button>

      {/* Chat control */}
      <button
        className="btn"
        style={{
          background: isChatOpen ? '#00ff88' : '#1a1a1a',
          color: isChatOpen ? '#000000' : '#00ff41',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isChatOpen ? '0 0 15px rgba(0, 255, 136, 0.6)' : '0 0 10px rgba(0, 255, 65, 0.3)',
          textShadow: isChatOpen ? '0 0 5px rgba(0, 255, 136, 0.3)' : '0 0 5px rgba(0, 255, 65, 0.3)'
        }}
        onClick={onToggleChat}
        title={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        💬
      </button>
    </div>
  );
};

export default Controls; 