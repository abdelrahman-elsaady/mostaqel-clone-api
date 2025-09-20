const jwt = require('jsonwebtoken');
const util = require('util');

async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized - No token provided' 
    });
  }

  try {
    const decoded = await util.promisify(jwt.verify)(authorization, process.env.SECRET);
    
    // Add user info to request object
    req.id = decoded.id;
    req.role = decoded.role;
    req.email = decoded.email;
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
}

function restrictTo(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied - Insufficient permissions' 
      });
    }
    
    next();
  };
}

module.exports = { auth, restrictTo };