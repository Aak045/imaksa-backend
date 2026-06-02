// middleware/auth.js — JWT Token Verification
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. Please login.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin not found.' 
      });
    }

    req.admin = admin;
    next();

  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token is invalid or expired. Please login again.' 
    });
  }
};

module.exports = { protect };
