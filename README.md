# TempShare - Temporary File & Text Sharing Service

## Features
A beautiful web application for temporarily sharing files and text with automatic 24-hour expiration and secure 5-digit access codes.
- **File Upload**: Drag-and-drop interface for files up to 10MB
- **Text Sharing**: Save and share text content easily
- **Secure Codes**: 5-digit access codes for content retrieval
- **Auto Expiration**: All content automatically deleted after 24 hours
- **File Preview**: Preview images and text content before download
- **Responsive Design**: Works perfectly on all devices
- **Real-time Feedback**: Live expiration countdown and status updates
## Quick Start
### Frontend Only (Browser Storage)
```bash
npm install
npm run dev
```
### With Backend Server
1. Start the backend server:
```bash
cd server
npm install
npm run dev
```
2. Create `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001/api
```
3. Start the frontend:
```bash
npm run dev
```
## Architecture
### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building
### Backend
- **Express.js** server
- **Multer** for file uploads
- **Node-cron** for automatic cleanup
- **CORS** enabled for cross-origin requests
## Deployment Options
### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Netlify (recommended)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
### Backend Deployment
Deploy the backend to any Node.js hosting service:
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS EC2/ECS
## Production Considerations
For production use, consider implementing:
1. **Database Storage**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Cloud File Storage**: Use AWS S3, Google Cloud Storage, or similar
3. **Authentication**: Add user accounts and access controls
4. **Rate Limiting**: Prevent abuse with request rate limiting
5. **Monitoring**: Add logging, error tracking, and performance monitoring
6. **Security**: Implement HTTPS, input validation, and security headers
7. **Scaling**: Use load balancers and CDN for high traffic
## API Documentation
See `server/README.md` for detailed API documentation.
## License
MIT License - feel free to use this project for personal or commercial purposes.