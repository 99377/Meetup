const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://meetup-backend-5kbp.onrender.com", "http://localhost:3000"]
      ? ["https://meetup-frontend-ajk6.onrender.com", "http://localhost:3000"]
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active rooms
const rooms = new Map();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Meet Up Server is running!' });
});

app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4().substring(0, 8);
  rooms.set(roomId, {
    id: roomId,
    participants: [],
    createdAt: new Date()
  });
  res.json({ roomId });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (room) {
    res.json({ exists: true, participants: room.participants.length });
  } else {
    res.json({ exists: false });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', (roomId, username) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        participants: [],
        createdAt: new Date()
      });
    }
    
    const room = rooms.get(roomId);
    const participant = {
      id: socket.id,
      username: username || `User-${socket.id.substring(0, 4)}`
    };
    
    room.participants.push(participant);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', participant);
    
    // Send current participants to the new user
    socket.emit('room-participants', room.participants);
    
    console.log(`${participant.username} joined room ${roomId}`);
  });

  // WebRTC signaling
  socket.on('offer', (offer, targetId) => {
    socket.to(targetId).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, targetId) => {
    socket.to(targetId).emit('answer', answer, socket.id);
  });

  socket.on('ice-candidate', (candidate, targetId) => {
    socket.to(targetId).emit('ice-candidate', candidate, socket.id);
  });

  // Chat messages
  socket.on('chat-message', (message, roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      const participant = room.participants.find(p => p.id === socket.id);
      const chatMessage = {
        id: uuidv4(),
        text: message,
        sender: participant?.username || 'Unknown',
        timestamp: new Date().toISOString()
      };
      io.to(roomId).emit('chat-message', chatMessage);
    }
  });

  // User controls (mute/unmute, camera on/off)
  socket.on('user-controls', (controls, roomId) => {
    socket.to(roomId).emit('user-controls', controls, socket.id);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms they were in
    for (const [roomId, room] of rooms.entries()) {
      const participantIndex = room.participants.findIndex(p => p.id === socket.id);
      if (participantIndex !== -1) {
        const participant = room.participants[participantIndex];
        room.participants.splice(participantIndex, 1);
        
        // Notify others in the room
        socket.to(roomId).emit('user-left', participant);
        
        // Remove room if empty
        if (room.participants.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
        
        console.log(`${participant.username} left room ${roomId}`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Meet Up Server running on port ${PORT}`);
  console.log(`Active rooms: ${rooms.size}`);
}); 
