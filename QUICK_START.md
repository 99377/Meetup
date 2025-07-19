# Quick Start Guide - Meet Up

Get your video conferencing app running in 5 minutes!

## 🚀 Super Quick Setup

### Option 1: Automatic Setup (Windows)
1. Double-click `install.bat` to install all dependencies
2. Double-click `start.bat` to start both server and client
3. Open http://localhost:3000 in your browser

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 2. Start the Application
```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm start
```

#### 3. Open Your Browser
Navigate to http://localhost:3000

## 🎯 Test the App

1. **Create a Meeting**
   - Enter your name (e.g., "Alice")
   - Click "Create Meeting"
   - Copy the room ID (e.g., "abc12345")

2. **Join from Another Browser/Device**
   - Open http://localhost:3000 in another browser/device
   - Enter a different name (e.g., "Bob")
   - Paste the room ID and click "Join Meeting"

3. **Test Features**
   - Allow camera/microphone permissions
   - Test mute/unmute buttons
   - Test camera on/off
   - Open chat and send messages
   - Try screen sharing (if supported)

## 🔧 Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions
- Try refreshing the page
- Ensure no other app is using the camera

### Connection Issues
- Make sure both server (port 5000) and client (port 3000) are running
- Check browser console for errors
- Try a different browser

### Room Not Found
- Ensure the room ID is copied correctly
- Check if the server is running
- Try creating a new room

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🎨 Customization

### Change Colors
Edit `client/src/index.css` to modify the color scheme:
```css
.btn-primary {
  background: #your-color; /* Change primary button color */
}
```

### Add Features
- Screen sharing: Add `getDisplayMedia()` API
- Recording: Implement MediaRecorder API
- Virtual backgrounds: Add canvas processing

## 🚀 Next Steps

1. **Deploy to Production**
   - See `DEPLOYMENT.md` for detailed instructions
   - Try Vercel + Render for free hosting

2. **Add More Features**
   - Screen sharing
   - Meeting recording
   - Virtual backgrounds
   - Breakout rooms

3. **Improve Security**
   - Add authentication
   - Implement room passwords
   - Add rate limiting

## 💡 Tips

- Use Chrome for best WebRTC performance
- Test with multiple devices for realistic scenarios
- Monitor browser console for debugging
- Use incognito mode to test with different users

## 🆘 Need Help?

- Check the browser console for error messages
- Ensure all dependencies are installed
- Verify both server and client are running
- Try restarting both applications

Happy video conferencing! 🎥✨ 