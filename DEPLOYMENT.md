# Deployment Guide for Meet Up

This guide covers deploying the Meet Up video conferencing app to various platforms.

## Prerequisites

- Git repository with your code
- Node.js knowledge
- Basic understanding of cloud platforms

## Option 1: Vercel (Frontend) + Render (Backend) - Recommended

### Frontend Deployment on Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure build settings:
     - **Framework Preset**: Create React App
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Install Command**: `npm install`

3. **Environment Variables** (if needed)
   - Add `REACT_APP_SERVER_URL` with your backend URL

### Backend Deployment on Render

1. **Create a Web Service**
   - Go to [render.com](https://render.com)
   - Sign up/Login
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `meet-up-backend`
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid for better performance)

3. **Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will set this automatically)

4. **Update CORS settings**
   In `server/server.js`, update the CORS origin:
   ```javascript
   cors: {
     origin: ["https://your-frontend-domain.vercel.app", "http://localhost:3000"],
     methods: ["GET", "POST"]
   }
   ```

5. **Update frontend Socket.IO URL**
   In `client/src/components/Room.js`:
   ```javascript
   const newSocket = io('https://your-backend-url.onrender.com');
   ```

## Option 2: Railway (Full Stack)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure services**
   - Railway will detect both client and server
   - Set up two services:
     - **Frontend Service**:
       - Build Command: `cd client && npm install && npm run build`
       - Start Command: `cd client && npm start`
     - **Backend Service**:
       - Build Command: `cd server && npm install`
       - Start Command: `cd server && npm start`

3. **Environment Variables**
   - Set `PORT` for backend
   - Set `REACT_APP_SERVER_URL` for frontend

## Option 3: Heroku

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd server
   heroku create your-meet-up-backend
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

### Frontend Deployment

1. **Create a separate Heroku app for frontend**
   ```bash
   cd client
   heroku create your-meet-up-frontend
   ```

2. **Add buildpack**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

## Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub repository

2. **Configure Services**
   - **Backend Service**:
     - Source: `server/`
     - Build Command: `npm install`
     - Run Command: `npm start`
   - **Frontend Service**:
     - Source: `client/`
     - Build Command: `npm install && npm run build`
     - Run Command: `npm start`

## Environment Variables Reference

### Backend Variables
```env
NODE_ENV=production
PORT=5000
```

### Frontend Variables
```env
REACT_APP_SERVER_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

- [ ] Test video/audio functionality
- [ ] Verify WebRTC connections work
- [ ] Check chat functionality
- [ ] Test room creation and joining
- [ ] Verify CORS settings
- [ ] Test on different browsers
- [ ] Check mobile responsiveness

## Troubleshooting Deployment

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS origin includes frontend URL
   - Check for trailing slashes in URLs

2. **Socket.IO Connection Issues**
   - Verify backend URL is correct
   - Check if backend is accessible
   - Ensure WebSocket connections are allowed

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for syntax errors

4. **WebRTC Issues**
   - Ensure HTTPS is enabled (required for WebRTC)
   - Check STUN server accessibility
   - Verify browser permissions

### Performance Optimization

1. **Enable compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers**
   ```javascript
   app.use(express.static('public', {
     maxAge: '1h'
   }));
   ```

3. **Use environment-specific configurations**
   ```javascript
   const isProduction = process.env.NODE_ENV === 'production';
   const corsOrigin = isProduction 
     ? ['https://your-domain.com'] 
     : ['http://localhost:3000'];
   ```

## Monitoring and Maintenance

1. **Set up logging**
   - Use services like LogRocket or Sentry
   - Monitor WebRTC connection quality
   - Track user sessions

2. **Performance monitoring**
   - Monitor server response times
   - Track WebRTC connection success rates
   - Monitor memory usage

3. **Regular updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Test new browser versions

## Cost Optimization

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month
- **Railway**: $5 credit/month
- **Heroku**: No free tier (discontinued)

### Scaling Considerations
- Monitor usage and upgrade when needed
- Consider CDN for static assets
- Implement rate limiting for API endpoints
- Use connection pooling for database (if added later) 