# TempShare Server

Backend server for the TempShare application that handles file uploads, text storage, and automatic cleanup.

## Features

- File upload with 10MB size limit
- Text content storage
- 5-digit code generation
- Automatic 24-hour expiration
- File download endpoints
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on port 3001 by default.

## API Endpoints

### Upload File
- **POST** `/api/upload/file`
- Body: FormData with 'file' field
- Response: `{ success: true, data: { code: "ABC12", expiresAt: timestamp } }`

### Upload Text
- **POST** `/api/upload/text`
- Body: `{ content: "text content" }`
- Response: `{ success: true, data: { code: "ABC12", expiresAt: timestamp } }`

### Retrieve Content
- **GET** `/api/retrieve/:code`
- Response: Content details with expiration info

### Download File
- **GET** `/api/download/:code`
- Response: File download

### Health Check
- **GET** `/api/health`
- Response: Server status

## Production Deployment

For production deployment, consider:

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage, etc.)
3. **Environment Variables**: Configure API URLs and secrets
4. **Security**: Add rate limiting, authentication for admin endpoints
5. **Monitoring**: Add logging and error tracking
6. **Scaling**: Use load balancers and multiple server instances

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: Database connection string (for production)
- `STORAGE_BUCKET`: Cloud storage bucket name (for production)