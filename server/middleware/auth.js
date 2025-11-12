const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware สำหรับตรวจสอบ token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        message: 'Please login to access this resource' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false,
            error: 'Token expired',
            message: 'Your session has expired. Please login again.' 
          });
        }
        
        return res.status(403).json({ 
          success: false,
          error: 'Invalid token',
          message: 'Invalid authentication token. Please login again.' 
        });
      }

      // เพิ่มข้อมูล user ใน request
      req.user = decoded;
      req.userId = decoded.userId || decoded.user_id || decoded.id;
      req.token = token;
      
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication' 
    });
  }
};

// Middleware สำหรับตรวจสอบว่าเป็น Admin หรือไม่
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized',
      message: 'Please login first' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied',
      message: 'Admin access required' 
    });
  }
  
  next();
};

// Middleware สำหรับตรวจสอบว่าเป็นเจ้าของ resource หรือไม่
const isOwner = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[resourceIdParam];
    const userId = req.userId;

    // Admin สามารถเข้าถึงได้ทั้งหมด
    if (req.user.role === 'admin') {
      return next();
    }

    // ตรวจสอบว่าเป็นเจ้าของหรือไม่
    if (parseInt(resourceId) !== parseInt(userId)) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied',
        message: 'You can only access your own resources' 
      });
    }

    next();
  };
};

// Middleware สำหรับตรวจสอบ role แบบยืดหยุ่น
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Please login first' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied',
        message: `This resource requires one of these roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = { 
  authenticateToken, 
  isAdmin, 
  isOwner,
  requireRole 
};