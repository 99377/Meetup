# Troubleshooting Guide - Meet Up

This guide helps you resolve common issues when using the Meet Up video conferencing app.

## 🚨 Common Errors and Solutions

### 1. "Cannot read properties of undefined (reading 'getUserMedia')"

**Problem**: Browser doesn't support MediaDevices API or running on insecure context.

**Solutions**:
- **Use HTTPS or localhost**: WebRTC requires a secure context
- **Update your browser**: Use Chrome, Firefox, Safari, or Edge (latest versions)
- **Check browser permissions**: Allow camera/microphone access
- **Try a different browser**: Some browsers have better WebRTC support

**Quick Fix**:
```bash
# If running locally, use localhost instead of IP address
http://localhost:3000  # ✅ Works
http://192.168.1.100:3000  # ❌ May not work
```

### 2. "Unable to connect to the server"

**Problem**: Backend server is not running or not accessible.

**Solutions**:
- **Start the server**: Run `cd server && npm start`
- **Check port 5000**: Ensure no other app is using port 5000
- **Check firewall**: Allow connections to port 5000
- **Verify server status**: Check terminal for server logs

**Quick Fix**:
```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm start
```

### 3. "Camera/Microphone not working"

**Problem**: Browser permissions or device issues.

**Solutions**:
- **Allow permissions**: Click "Allow" when browser asks for camera/microphone
- **Check device connections**: Ensure camera/microphone are connected
- **Close other apps**: Other apps might be using the camera
- **Refresh the page**: Sometimes permissions need a page refresh

**Quick Fix**:
1. Click the camera icon in browser address bar
2. Select "Allow" for camera and microphone
3. Refresh the page

### 4. "Room not found" or "Cannot join meeting"

**Problem**: Room doesn't exist or server issues.

**Solutions**:
- **Check room ID**: Ensure it's copied correctly
- **Create new room**: Try creating a new meeting
- **Check server**: Ensure backend is running
- **Clear browser cache**: Sometimes cached data causes issues

### 5. "Video not displaying" or "Black screen"

**Problem**: WebRTC connection issues or device problems.

**Solutions**:
- **Check internet connection**: WebRTC needs stable internet
- **Try different browser**: Chrome has best WebRTC support
- **Check device**: Ensure camera is working in other apps
- **Restart browser**: Close and reopen browser

### 6. "Audio not working" or "No sound"

**Problem**: Audio device or permission issues.

**Solutions**:
- **Check audio output**: Ensure correct speakers/headphones selected
- **Check volume**: Ensure system and browser volume are up
- **Allow microphone**: Grant microphone permissions
- **Test audio**: Use browser's audio test feature

## 🔧 Browser-Specific Issues

### Chrome
- **Best WebRTC support**
- **Enable flags**: Go to `chrome://flags/` and enable WebRTC features
- **Check permissions**: Settings > Privacy and security > Site settings

### Firefox
- **Good WebRTC support**
- **Check about:config**: Search for `media.navigator.enabled`
- **Permissions**: Settings > Privacy & Security > Permissions

### Safari
- **Limited WebRTC support**
- **Requires HTTPS**: Must use secure connection
- **Check permissions**: Safari > Preferences > Websites

### Edge
- **Good WebRTC support**
- **Based on Chromium**: Similar to Chrome
- **Check permissions**: Settings > Cookies and site permissions

## 🌐 Network Issues

### Firewall Problems
```bash
# Windows - Allow Node.js through firewall
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe"

# macOS - Allow in System Preferences
System Preferences > Security & Privacy > Firewall > Firewall Options
```

### Proxy Issues
- **Corporate networks**: May block WebRTC
- **VPN**: Can interfere with peer-to-peer connections
- **Mobile networks**: Some carriers block certain ports

## 🛠️ Development Issues

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill process
taskkill /PID <process_id>    # Windows
kill -9 <process_id>          # macOS/Linux
```

### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Should be 14 or higher
# If not, update Node.js from https://nodejs.org/
```

### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Issues

### iOS Safari
- **Limited WebRTC support**
- **Requires HTTPS**
- **May need user interaction**: Tap screen to start video

### Android Chrome
- **Good WebRTC support**
- **Check permissions**: Settings > Apps > Chrome > Permissions
- **Clear cache**: Settings > Apps > Chrome > Storage > Clear cache

## 🔍 Debugging Steps

### 1. Check Browser Console
```javascript
// Open Developer Tools (F12)
// Look for errors in Console tab
// Check Network tab for failed requests
```

### 2. Test WebRTC Support
```javascript
// Run in browser console
console.log('MediaDevices:', !!navigator.mediaDevices);
console.log('getUserMedia:', !!navigator.mediaDevices?.getUserMedia);
console.log('RTCPeerConnection:', !!window.RTCPeerConnection);
```

### 3. Test Server Connection
```bash
# Test if server is responding
curl http://localhost:5000
# Should return: {"message":"Meet Up Server is running!"}
```

### 4. Check Network Connectivity
```bash
# Test localhost connectivity
ping localhost
telnet localhost 5000
```

## 🆘 Getting Help

### Before Asking for Help
1. **Check this troubleshooting guide**
2. **Try different browsers**
3. **Check browser console for errors**
4. **Verify server is running**
5. **Test with different devices**

### Information to Provide
- **Browser and version**
- **Operating system**
- **Error messages from console**
- **Steps to reproduce the issue**
- **Network environment (home/office/public)**

### Common Solutions Summary
1. **Use HTTPS or localhost**
2. **Allow camera/microphone permissions**
3. **Update browser to latest version**
4. **Restart both server and client**
5. **Clear browser cache and cookies**
6. **Check firewall settings**
7. **Try different browser/device**

## 🎯 Quick Diagnostic Checklist

- [ ] Server running on port 5000
- [ ] Client running on port 3000
- [ ] Using HTTPS or localhost
- [ ] Browser supports WebRTC
- [ ] Camera/microphone permissions granted
- [ ] No firewall blocking connections
- [ ] Stable internet connection
- [ ] No other apps using camera/microphone

If all items are checked and issues persist, try:
1. Restart computer
2. Use different network
3. Try different device
4. Check for system updates 