const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// In-memory storage for demo (use database in production)
const storage_db = new Map();

// Generate 5-digit code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Cleanup expired items
const cleanupExpired = () => {
  const now = Date.now();
  for (const [code, item] of storage_db.entries()) {
    if (item.expiresAt <= now) {
      // Delete file if it exists
      if (item.type === 'file' && item.filePath) {
        try {
          fs.unlinkSync(item.filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      storage_db.delete(code);
    }
  }
};

// Run cleanup every minute
cron.schedule('* * * * *', cleanupExpired);

// Routes

// Upload file
app.post('/api/upload/file', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const code = generateCode();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    const item = {
      code,
      type: 'file',
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      fileUrl: `/uploads/${req.file.filename}`,
      createdAt: Date.now(),
      expiresAt
    };

    storage_db.set(code, item);

    res.json({
      success: true,
      data: {
        code,
        expiresAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
});

// Upload text
app.post('/api/upload/text', (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content provided'
      });
    }

    const code = generateCode();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    const item = {
      code,
      type: 'text',
      content: content.trim(),
      createdAt: Date.now(),
      expiresAt
    };

    storage_db.set(code, item);

    res.json({
      success: true,
      data: {
        code,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Text upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during text save'
    });
  }
});

// Retrieve content
app.get('/api/retrieve/:code', (req, res) => {
  try {
    const { code } = req.params;
    const item = storage_db.get(code.toUpperCase());

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Content not found or has expired'
      });
    }

    // Check if expired
    if (item.expiresAt <= Date.now()) {
      // Clean up expired item
      if (item.type === 'file' && item.filePath) {
        try {
          fs.unlinkSync(item.filePath);
        } catch (error) {
          console.error('Error deleting expired file:', error);
        }
      }
      storage_db.delete(code.toUpperCase());
      
      return res.status(404).json({
        success: false,
        message: 'Content has expired'
      });
    }

    const response = {
      type: item.type,
      expiresAt: item.expiresAt
    };

    if (item.type === 'text') {
      response.content = item.content;
    } else {
      response.fileName = item.fileName;
      response.fileType = item.fileType;
      response.fileSize = item.fileSize;
      response.fileUrl = `${req.protocol}://${req.get('host')}${item.fileUrl}`;
    }

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Retrieve error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during retrieval'
    });
  }
});

// Download file
app.get('/api/download/:code', (req, res) => {
  try {
    const { code } = req.params;
    const item = storage_db.get(code.toUpperCase());

    if (!item || item.type !== 'file') {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if expired
    if (item.expiresAt <= Date.now()) {
      return res.status(404).json({
        success: false,
        message: 'File has expired'
      });
    }

    // Send file
    res.download(item.filePath, item.fileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during download'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});