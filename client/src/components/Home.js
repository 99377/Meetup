import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      navigate(`/room/${data.roomId}`, { state: { username } });
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!username.trim() || !roomId.trim()) {
      alert('Please enter your name and room ID');
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      const data = await response.json();
      
      if (data.exists) {
        navigate(`/room/${roomId}`, { state: { username } });
      } else {
        alert('Room not found. Please check the room ID.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '100px auto' }}>
        <div className="text-center mb-4">
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#00ff41', 
            marginBottom: '8px',
            textShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
            fontWeight: 'bold'
          }}>
            Meet Up
          </h1>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            Video conferencing made simple
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#00ff41' }}>
              Your Name
            </label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createRoom()}
            />
          </div>

          <div className="flex gap-4">
            <button
              className="btn btn-primary flex-1"
              onClick={createRoom}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <span style={{ color: '#00ff41', fontWeight: 'bold' }}>or</span>
          </div>

          <div>
            <label htmlFor="roomId" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#00ff41' }}>
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              className="input"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
          </div>

          <button
            className="btn btn-secondary"
            onClick={joinRoom}
            disabled={isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Meeting'}
          </button>
        </div>

        <div className="text-center mt-4" style={{ color: '#cccccc', fontSize: '0.9rem' }}>
          <p>Share the room ID with others to invite them to your meeting</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 