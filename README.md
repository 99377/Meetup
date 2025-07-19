# Meet Up - Video Conferencing App

A real-time video conferencing web application built with WebRTC, React, and Node.js. Similar to Google Meet, this app allows users to create and join video meetings with peer-to-peer connections.

## Features

- 🎥 **Real-time Video Calls**: Peer-to-peer video and audio using WebRTC
- 🎤 **Audio Controls**: Mute/unmute microphone
- 📹 **Video Controls**: Turn camera on/off
- 💬 **Live Chat**: Real-time messaging during calls
- 🔗 **Easy Sharing**: Create and join meetings via room codes
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Modern UI**: Clean and intuitive interface

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio streaming
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Meet Up/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── Room.js
│   │   │   ├── VideoPlayer.js
│   │   │   ├── Controls.js
│   │   │   └── Chat.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Meet Up
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```
   The React app will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to start using the app

### Usage

1. **Create a Meeting**
   - Enter your name
   - Click "Create Meeting"
   - Share the room ID with others

2. **Join a Meeting**
   - Enter your name and the room ID
   - Click "Join Meeting"

3. **During the Call**
   - Use the control buttons to mute/unmute and turn camera on/off
   - Click the chat button to open/close the chat panel
   - Click "Leave Meeting" to exit

## Deployment

### Option 1: Vercel + Render (Recommended)

#### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build settings:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

#### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables: Set `PORT` if needed

### Option 2: Railway

1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your repository
4. Deploy both frontend and backend services

### Option 3: Heroku

1. Create a `Procfile` in the server directory:
   ```
   web: node server.js
   ```

2. Deploy to Heroku:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
```

### Frontend
Update the Socket.IO connection URL in `client/src/components/Room.js`:
```javascript
const newSocket = io('https://your-backend-url.com');
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Troubleshooting

### Common Issues

1. **Camera/Microphone not working**
   - Ensure you've granted camera and microphone permissions
   - Try refreshing the page
   - Check if another app is using the camera

2. **Connection issues**
   - Check if the backend server is running
   - Verify the Socket.IO connection URL
   - Check browser console for errors

3. **Video not displaying**
   - Ensure WebRTC is supported in your browser
   - Check if STUN servers are accessible
   - Try using a different browser

### Development

For development with auto-reload:
```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.IO for real-time signaling
- React community for excellent documentation 