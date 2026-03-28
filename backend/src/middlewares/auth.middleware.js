const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // Debug log (remove later if needed)
    console.log("AUTH HEADER:", authHeader);

    // Check header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );

    // Debug log
    console.log("DECODED USER:", decoded);

    // Attach user to request
    req.user = decoded;

    next();

  } catch (error) {

    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: 'Invalid token'
    });

  }

};