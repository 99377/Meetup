import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import VideoPlayer from './VideoPlayer';
import Chat from './Chat';
import Controls from './Controls';

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || 'Anonymous';

  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [participants, setParticipants] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [mediaError, setMediaError] = useState(null);

  const peerConnections = useRef(new Map());
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    // Check if running on secure context (HTTPS or localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      alert('Camera and microphone access requires a secure connection (HTTPS). Please use HTTPS or localhost.');
      return;
    }

    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:5000', {
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      alert('Unable to connect to the server. Please make sure the backend server is running on port 5000.');
    });
    
    setSocket(newSocket);

    // Check if MediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API not supported');
      
      // Fallback for older browsers
      const getUserMedia = navigator.getUserMedia || 
                          navigator.webkitGetUserMedia || 
                          navigator.mozGetUserMedia || 
                          navigator.msGetUserMedia;
      
      if (!getUserMedia) {
        alert('Your browser does not support camera/microphone access. Please use a modern browser like Chrome, Firefox, or Safari.');
        return;
      }
      
      // Use legacy API
      getUserMedia.call(navigator, { video: true, audio: true }, 
        (stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        },
        (error) => {
          console.error('Error accessing media devices:', error);
          alert('Unable to access camera/microphone. Please check permissions and try again.');
        }
      );
      return;
    }

    // Get user media with fallback
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = 'Unable to access camera/microphone. ';
        
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera and microphone permissions and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera or microphone found. Please connect a device and try again.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Your browser does not support video/audio capture.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera or microphone is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera or microphone does not meet the required constraints.';
        } else if (error.name === 'TypeError') {
          errorMessage += 'Please use HTTPS or localhost for camera/microphone access.';
        } else {
          errorMessage += 'Please check your device permissions and try again.';
        }
        
        setMediaError(errorMessage);
        console.error('Media error:', error);
      }
    };

    getUserMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      newSocket.disconnect();
    };
  }, [username, navigate]);

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit('join-room', roomId, username);

    // Socket event listeners
    socket.on('user-joined', (participant) => {
      setParticipants(prev => [...prev, participant]);
      createPeerConnection(participant.id);
    });

    socket.on('user-left', (participant) => {
      setParticipants(prev => prev.filter(p => p.id !== participant.id));
      removePeerConnection(participant.id);
    });

    socket.on('room-participants', (roomParticipants) => {
      setParticipants(roomParticipants.filter(p => p.id !== socket.id));
      roomParticipants.forEach(participant => {
        if (participant.id !== socket.id) {
          createPeerConnection(participant.id);
        }
      });
    });

    // WebRTC signaling
    socket.on('offer', async (offer, senderId) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', answer, senderId);
      }
    });

    socket.on('answer', async (answer, senderId) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async (candidate, senderId) => {
      const pc = peerConnections.current.get(senderId);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Chat messages
    socket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    // User controls
    socket.on('user-controls', (controls, senderId) => {
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        const stream = newMap.get(senderId);
        if (stream) {
          const audioTrack = stream.getAudioTracks()[0];
          const videoTrack = stream.getVideoTracks()[0];
          if (audioTrack) audioTrack.enabled = !controls.isAudioMuted;
          if (videoTrack) videoTrack.enabled = !controls.isVideoOff;
        }
        return newMap;
      });
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('room-participants');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');
      socket.off('user-controls');
    };
  }, [socket, roomId, username]);

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnections.current.set(peerId, pc);

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, event.streams[0]);
        return newMap;
      });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, peerId);
      }
    };

    // Create and send offer
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', offer, peerId);
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    };
  };

  const removePeerConnection = (peerId) => {
    const pc = peerConnections.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(peerId);
    }
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        socket.emit('user-controls', { isAudioMuted: !audioTrack.enabled }, roomId);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        socket.emit('user-controls', { isVideoOff: !videoTrack.enabled }, roomId);
      }
    }
  };

  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('chat-message', message, roomId);
    }
  };

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    peerConnections.current.forEach(pc => pc.close());
    if (socket) {
      socket.disconnect();
    }
    navigate('/');
  };

  // Show error state if media devices are not available
  if (mediaError) {
    return (
      <div className="container" style={{ height: '100vh', padding: '20px' }}>
        <div style={{ display: 'flex', height: '100%', gap: '20px' }}>
          {/* Main area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px',
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 65, 0.1)',
              border: '1px solid #333333'
            }}>
              <div>
                <h2 style={{ color: '#00ff41', margin: 0, textShadow: '0 0 10px rgba(0, 255, 65, 0.5)' }}>Meet Up</h2>
                <p style={{ color: '#cccccc', margin: '4px 0 0 0' }}>
                  Room: {roomId} • {participants.length + 1} participants
                </p>
              </div>
              <button className="btn btn-danger" onClick={leaveRoom}>
                Leave Meeting
              </button>
            </div>

            {/* Error message */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 65, 0.1)',
              border: '1px solid #333333'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📹</div>
              <h3 style={{ color: '#ff0040', marginBottom: '16px', textShadow: '0 0 10px rgba(255, 0, 64, 0.5)' }}>Camera/Microphone Access Required</h3>
              <p style={{ color: '#cccccc', marginBottom: '24px', maxWidth: '500px' }}>
                {mediaError}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setMediaError(null)}
                >
                  Continue with Chat Only
                </button>
              </div>
            </div>

            {/* Chat-only controls */}
            <div style={{ marginTop: '20px' }}>
              <Controls
                isAudioMuted={true}
                isVideoOff={true}
                onToggleAudio={() => {}}
                onToggleVideo={() => {}}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                isChatOpen={isChatOpen}
                disabled={true}
              />
            </div>
          </div>

          {/* Chat sidebar */}
          {isChatOpen && (
            <div style={{ width: '300px' }}>
              <Chat
                messages={chatMessages}
                onSendMessage={sendMessage}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ height: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', height: '100%', gap: '20px' }}>
        {/* Main video area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div>
              <h2 style={{ color: '#4f46e5', margin: 0 }}>Meet Up</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                Room: {roomId} • {participants.length + 1} participants
              </p>
            </div>
            <button className="btn btn-danger" onClick={leaveRoom}>
              Leave Meeting
            </button>
          </div>

          {/* Video grid */}
          <div style={{ 
            flex: 1, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Local video */}
            <VideoPlayer
              stream={localStream}
              username={`${username} (You)`}
              isLocal={true}
              isAudioMuted={isAudioMuted}
              isVideoOff={isVideoOff}
            />

            {/* Remote videos */}
            {Array.from(remoteStreams.entries()).map(([peerId, stream]) => {
              const participant = participants.find(p => p.id === peerId);
              return (
                <VideoPlayer
                  key={peerId}
                  stream={stream}
                  username={participant?.username || 'Unknown'}
                  isLocal={false}
                />
              );
            })}
          </div>

          {/* Controls */}
          <Controls
            isAudioMuted={isAudioMuted}
            isVideoOff={isVideoOff}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
          />
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div style={{ width: '300px' }}>
            <Chat
              messages={chatMessages}
              onSendMessage={sendMessage}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Room; 