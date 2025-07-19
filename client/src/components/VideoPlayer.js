import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, username, isLocal, isAudioMuted, isVideoOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{
      position: 'relative',
      background: '#0a0a0a',
      borderRadius: '12px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      minHeight: '200px',
      border: '1px solid #333333',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)'
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      {/* Username overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff41',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        textShadow: '0 0 5px rgba(0, 255, 65, 0.5)',
        border: '1px solid #00ff41'
      }}>
        {username}
      </div>

      {/* Status indicators */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '8px'
      }}>
        {isAudioMuted && (
          <div style={{
            background: 'rgba(255, 0, 64, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 0 10px rgba(255, 0, 64, 0.5)',
            textShadow: '0 0 5px rgba(255, 0, 64, 0.3)'
          }}>
            🔇 Muted
          </div>
        )}
        
        {isVideoOff && (
          <div style={{
            background: 'rgba(255, 0, 64, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 0 10px rgba(255, 0, 64, 0.5)',
            textShadow: '0 0 5px rgba(255, 0, 64, 0.3)'
          }}>
            📹 Off
          </div>
        )}
      </div>

      {/* Local indicator */}
      {isLocal && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0, 255, 65, 0.9)',
          color: 'black',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
          textShadow: '0 0 5px rgba(0, 255, 65, 0.3)'
        }}>
          You
        </div>
      )}

      {/* No video placeholder */}
      {isVideoOff && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#00ff41',
          textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📹</div>
          <div style={{ fontSize: '16px' }}>Camera is off</div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 