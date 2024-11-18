// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;  // Save user info to request object
    next();
  });
}

// Middleware to check if the user is a Builder
function requireBuilder(req, res, next) {
  if (req.user.role !== 'Builder') {
    return res.status(403).json({ error: 'Access restricted to Builders only.' });
  }
  next();
}

// Middleware to check if the user is an Investor
function requireInvestor(req, res, next) {
  if (req.user.role !== 'Investor') {
    return res.status(403).json({ error: 'Access restricted to Investors only.' });
  }
  next();
}

module.exports = { authenticateToken, requireBuilder, requireInvestor };
















// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization')?.split(' ')[1];
  
//   if (!token) return res.status(403).json({ error: 'Access denied' });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.userId = user.userId;
//     next();
//   });
// }

// module.exports = authenticateToken;