const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticate };
    